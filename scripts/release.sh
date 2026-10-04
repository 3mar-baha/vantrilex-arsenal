#!/usr/bin/env bash
#
# release.sh — one-command release publishing for Vantrilex Arsenal.
#
# Given a version, it performs the full ship sequence:
#   1. Derives the semver, validating it and locating its CHANGELOG section.
#   2. Extracts that section as the release notes, so nothing is invented.
#   3. Refuses on a missing CHANGELOG entry, a dirty work tree, a detached
#      HEAD, or an existing v<version> tag.
#   4. Creates the annotated tag and pushes the branch and the tag, so a
#      release can never exist without its tag.
#   5. Creates the GitHub release from the extracted notes with gh.
#
# Usage:
#   ./scripts/release.sh <VERSION> [--draft] [-h | --help]
#
#   VERSION   X.Y.Z, or X.Y.Z.W. A leading "v" is accepted and stripped.
#   --draft   create the GitHub release as a draft for review.
#
# Exit status:
#   0 — tagged, pushed, and released
#   1 — refused on purpose (bad version, missing CHANGELOG entry, dirty tree,
#       detached HEAD, existing tag) or a publish failure

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
CHANGELOG="${REPO_ROOT}/CHANGELOG.md"

log_info() { printf '[release] %s\n' "$*"; }
log_error() { printf '[release] ERROR: %s\n' "$*" >&2; }

usage() {
    cat <<EOF
release.sh — tag, push, and publish a release from the CHANGELOG notes.

Usage:
  ./scripts/release.sh <VERSION> [--draft]

  VERSION    X.Y.Z or X.Y.Z.W matching a '## [<VERSION>]' section in
             CHANGELOG.md. A leading 'v' is stripped.

Exit status:
  0    Tagged, pushed, and released.
  1    Refused or publish failed. Nothing partial is left behind except an
       already-pushed tag, which is reported explicitly.
EOF
}

extract_notes() {
    # extract_notes <version> — printing turns on at this version's heading and
    # off at the next one, so the notes are exactly what the changelog says.
    awk -v "ver=$1" '
        /^## \[[0-9]/ { on = (index($0, "## [" ver "]") == 1) }
        on { print }
    ' "$CHANGELOG"
}

main() {
    local version="" draft=""
    local notes branch tag repo_slug
    local create_args

    while [ $# -gt 0 ]; do
        case "$1" in
            -h | --help) usage; exit 0 ;;
            --draft) draft=1; shift ;;
            *)
                if [ -z "$version" ]; then
                    version="$1"
                else
                    log_error "unexpected argument: $1"
                    usage >&2
                    exit 1
                fi
                shift
                ;;
        esac
    done

    case "$version" in
        [vV][0-9]*) version="${version#[vV]}" ;;
    esac
    if ! printf '%s' "$version" | grep -qE '^[0-9]+(\.[0-9]+){2,3}$'; then
        log_error "VERSION must be X.Y.Z or X.Y.Z.W (got: '${version:-empty}')."
        usage >&2
        exit 1
    fi

    if [ ! -f "$CHANGELOG" ]; then
        log_error "no changelog at ${CHANGELOG#"$REPO_ROOT"/}."
        exit 1
    fi

    notes="$(mktemp)"
    trap 'rm -f "$notes"' EXIT
    extract_notes "$version" > "$notes"
    if ! grep -q '^## \[' "$notes"; then
        log_error "CHANGELOG.md has no '## [$version]' section; add the entry before releasing."
        exit 1
    fi

    if [ -n "$(git -C "$REPO_ROOT" status --porcelain)" ]; then
        log_error 'work tree is dirty; commit everything before releasing.'
        exit 1
    fi

    branch="$(git -C "$REPO_ROOT" branch --show-current)"
    if [ -z "$branch" ]; then
        log_error 'detached HEAD; run this from a branch.'
        exit 1
    fi

    tag="v${version}"
    if git -C "$REPO_ROOT" rev-parse -q --verify "refs/tags/${tag}" > /dev/null; then
        log_error "tag ${tag} already exists locally."
        exit 1
    fi

    if ! command -v gh > /dev/null 2>&1; then
        log_error 'gh is not installed; install it and authenticate before releasing.'
        exit 1
    fi

    log_info "releasing ${tag} from branch ${branch} ($(wc -l < "$notes" | tr -d ' ') note lines)"

    if ! git -C "$REPO_ROOT" tag -a "$tag" -m "${tag}"; then
        log_error 'git tag failed.'
        exit 1
    fi
    if ! git -C "$REPO_ROOT" push origin "$branch" "$tag"; then
        log_error "push failed; the local tag ${tag} was NOT removed."
        log_error "delete it manually before re-running: git tag -d ${tag}"
        exit 1
    fi

    create_args=(--title "${tag}" --notes-file "$notes")
    [ -n "$draft" ] && create_args+=(--draft)
    if ! gh release create "$tag" "${create_args[@]}"; then
        log_error "gh release create failed for ${tag}; the tag is pushed, so re-run with --draft or finish in the UI."
        exit 1
    fi

    repo_slug="$(git -C "$REPO_ROOT" remote get-url origin | sed -E 's#.*github\.com[/:]##; s#\.git$##')"
    log_info "released ${tag}: https://github.com/${repo_slug}/releases/tag/${tag}"
    exit 0
}

main "$@"
