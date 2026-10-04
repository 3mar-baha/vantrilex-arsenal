#!/usr/bin/env bash
#
# merge-worktrees.sh — gate, integrate, and prune one dispatched concern.
#
# For a worktree provisioned by dispatch-worktrees.sh it:
#   1. Runs the regression gate over the concern's diff against the base
#      branch: `bash -n` plus shellcheck (when installed) on changed shell
#      scripts, markdownlint (when node is available) on changed markdown.
#   2. Merges wt/<concern-slug> into the current branch with --no-ff, so history
#      keeps one merge commit per concern.
#   3. Prunes the worktree and its branch (--keep retains both).
#   4. Stamps docs/17-CHECKPOINT.md with one integration line.
#
# Checkpoint schema — docs/17-CHECKPOINT.md
# ------------------------------------------
# Read as labeled lines; see dispatch-worktrees.sh for the full field set.
# This script consumes one field:
#
#   Status:    ACTIVE | BLOCKED     Required. BLOCKED refuses the merge,
#                                  because integrating into a halted session
#                                  hides the halt from the next one.
#
# Refuses when the checkpoint is BLOCKED, the index is dirty, the concern slug
# is unsafe, the branch does not exist, or the regression gate fails.
#
# Usage:
#   ./scripts/merge-worktrees.sh <CONCERN_SLUG> [--keep] [-h | --help]
#
# Exit status:
#   0 — merged and pruned (or kept, with --keep)
#   1 — refused on purpose or gate failure; nothing was merged

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
CHECKPOINT="${REPO_ROOT}/docs/17-CHECKPOINT.md"
WORKTREE_ROOT="${REPO_ROOT}/.worktrees"

log_info() { printf '[merge] %s\n' "$*"; }
log_error() { printf '[merge] ERROR: %s\n' "$*" >&2; }

usage() {
    cat <<EOF
merge-worktrees.sh — verify, integrate, and prune one dispatched concern.

Usage:
  ./scripts/merge-worktrees.sh <CONCERN_SLUG> [--keep]

  --keep    keep the worktree directory and branch after merging.

Exit status:
  0    Concern merged into the current branch with --no-ff.
  1    Refused (BLOCKED, dirty index, unsafe slug, unknown branch) or the
       regression gate failed. Nothing is merged on failure.
EOF
}

read_checkpoint_field() {
    # The bold markers sit on either side of the colon in either convention
    # ("**Label:** v" and "**Label**: v"), and the label itself may be bulleted
    # or indented, so both are tolerated rather than pinning one writer format.
    sed -n -E "s/^[[:space:]]*[-*]?[[:space:]]*(\*\*)?$1[[:space:]]*(\*\*)?[[:space:]]*:[[:space:]]*(\*\*)?[[:space:]]*//Ip" \
        "$CHECKPOINT" 2> /dev/null | head -n 1
}

validate_concern_slug() {
    case "$1" in
        '' | *[!a-z0-9-]* | -* | *-)
            log_error "concern slug must be lowercase kebab-case: '$1'"
            return 1
            ;;
        *) return 0 ;;
    esac
}

stamp_checkpoint() {
    # stamp_checkpoint <concern> <sha> — one line per integrated concern, so the
    # next session inherits which concerns already landed.
    printf 'integrated: %s @ %s (%s)\n' "$1" "$2" "$(date +%Y-%m-%d)" >> "$CHECKPOINT"
}

gate_changed_files() {
    # gate_changed_files <worktree_dir> <branch> — diff-scoped quality gate.
    # The file list comes from the repository, which knows both refs; files are
    # read at their branch-tip versions inside the worktree.
    local wt="$1"
    local branch="$2"
    local base sh_files md_files f rc=0

    base="$(git -C "$REPO_ROOT" merge-base HEAD "$branch")"
    sh_files="$(git -C "$REPO_ROOT" diff --name-only --diff-filter=ACMR "$base" "$branch" -- '*.sh' '*.bash' || true)"
    md_files="$(git -C "$REPO_ROOT" diff --name-only --diff-filter=ACMR "$base" "$branch" -- '*.md' || true)"

    # Word splitting is intended: git emits one path per line and repository
    # paths carry no spaces.
    # shellcheck disable=SC2086
    for f in $sh_files; do
        log_info "gate bash -n: $f"
        bash -n "$wt/$f" || rc=1
        if command -v shellcheck > /dev/null 2>&1; then
            shellcheck "$wt/$f" || rc=1
        fi
    done

    if [ -n "$md_files" ] && command -v npx > /dev/null 2>&1; then
        # shellcheck disable=SC2086
        (cd "$REPO_ROOT" && npx --yes markdownlint-cli $md_files) || rc=1
    fi

    if [ -z "$sh_files" ] && [ -z "$md_files" ]; then
        log_info 'no shell or markdown changes in the concern diff; nothing to gate.'
    fi
    return "$rc"
}

main() {
    local concern="" keep=0 arg
    local wt branch short_sha current

    while [ $# -gt 0 ]; do
        arg="$1"
        case "$arg" in
            -h | --help) usage; exit 0 ;;
            --keep) keep=1 ;;
            *) concern="$arg" ;;
        esac
        shift
    done

    if [ -z "$concern" ]; then
        log_error 'CONCERN_SLUG is required.'
        usage >&2
        exit 1
    fi

    validate_concern_slug "$concern" || exit 1

    if [ ! -f "$CHECKPOINT" ]; then
        log_error "no checkpoint at ${CHECKPOINT#"$REPO_ROOT"/}; cannot read status."
        exit 1
    fi

    if [ "$(read_checkpoint_field 'Status')" = 'BLOCKED' ]; then
        log_error 'checkpoint Status is BLOCKED; resolve the Diagnostic Incident Report before integrating.'
        exit 1
    fi

    if [ -n "$(git -C "$REPO_ROOT" diff --cached --name-only)" ]; then
        log_error 'staged changes detected in the repository; commit them first.'
        exit 1
    fi

    wt="${WORKTREE_ROOT}/${concern}"
    branch="wt/${concern}"

    if [ ! -d "$wt" ] || ! git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/$branch"; then
        log_error "unknown concern '$concern' (expected $wt on branch $branch)."
        exit 1
    fi

    log_info "running the regression gate for '$concern'..."
    if ! gate_changed_files "$wt" "$branch"; then
        log_error "regression gate failed for '$concern'; nothing merged."
        exit 1
    fi

    current="$(git -C "$REPO_ROOT" branch --show-current)"
    log_info "merging $branch into $current (--no-ff)"
    if ! git -C "$REPO_ROOT" merge --no-ff --no-edit "$branch"; then
        log_error 'merge conflict; resolve it in the repository, then re-run.'
        exit 1
    fi

    short_sha="$(git -C "$REPO_ROOT" rev-parse --short HEAD)"
    stamp_checkpoint "$concern" "$short_sha"

    if [ "$keep" -eq 1 ]; then
        log_info '--keep set; worktree and branch left intact.'
    else
        git -C "$REPO_ROOT" worktree remove "$wt" || {
            log_error "could not remove worktree $wt; prune it manually."
            exit 1
        }
        git -C "$REPO_ROOT" branch -d "$branch" > /dev/null
        log_info "pruned worktree and branch for '$concern'."
    fi

    log_info "concern '$concern' integrated @ $short_sha."
    exit 0
}

main "$@"
