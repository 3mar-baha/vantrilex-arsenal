#!/usr/bin/env bash
#
# auto-publish.sh — verification-gated, idempotent auto-publish for v0.0.x
# patch releases.
#
# The rule this script implements: the moment a v0.0.x release is published,
# its distributable is built from the exact tagged commit, proven against the
# repository's verification battery, and attached to the release — with no
# manual upload step. Minors and majors never auto-publish; they print an
# owner-gated notice and exit 0.
#
# Usage:
#   scripts/auto-publish.sh [TAG] [--self-test] [-h | --help]
#
#   TAG          The release tag to publish. When omitted, the newest tag
#                reachable from HEAD is used (git describe --tags --abbrev=0).
#   --self-test  Exercise the tag guard, the idempotency decision and the
#                audit-line shape against fixed inputs. No network call and no
#                write of any kind: it proves the risky logic offline.
#
# Environment:
#   DRY_RUN=1|0       Default 1. In dry-run the script resolves the tag, builds
#                     the artifact, runs the full gate and prints every channel
#                     and asset it would publish. It uploads nothing and never
#                     marks a release latest. Publishing needs DRY_RUN=0.
#   AUDIT_LOG=<path>  Default .opencode/audit/AUTO-PUBLISH.log.
#   PUBLISH_REPO=slug Default: the origin remote's owner/name.
#
# Exit status:
#   0  published, replaced, skipped as identical, owner-gated (not a v0.0.x
#      patch), or a dry-run whose gate passed
#   1  refused or failed — gate not proven, tag unresolved, packaged path
#      missing, tooling absent, or an upload failed. Fail closed: a gate that
#      cannot be evaluated is a failed gate, and a failed gate uploads nothing.

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DRY_RUN="${DRY_RUN:-1}"
AUDIT_LOG="${AUDIT_LOG:-${REPO_ROOT}/.opencode/audit/AUTO-PUBLISH.log}"

# The release workflow's strict path set, reused verbatim so an auto-published
# tarball has exactly the shape docs/14-CI-RELEASE.md describes. A missing path
# fails the run rather than shipping a thinner archive than the notes describe.
PACKAGE_PATHS=(
    AGENTS.md AI_GUIDE.md CHANGELOG.md CONTRIBUTING.md LICENSE README.md
    README.ar.md SECURITY.md
    registry .opencode scripts kit docs
    .editorconfig .gitattributes .gitignore .markdownlint.jsonc
)

log() { printf '[auto-publish] %s\n' "$*"; }
log_error() { printf '[auto-publish] ERROR: %s\n' "$*" >&2; }

usage() {
    cat <<'EOF'
auto-publish.sh — verification-gated, idempotent publishing of v0.0.x patches.

Usage:
  scripts/auto-publish.sh [TAG] [--self-test]

  TAG          Release tag. Defaults to the newest tag reachable from HEAD.
  --self-test  Prove the tag guard, the idempotency decision and the audit-line
               shape offline. No network call, no write.

Environment:
  DRY_RUN=1|0       Default 1: build, gate and report only. Never upload.
  AUDIT_LOG=<path>  Default .opencode/audit/AUTO-PUBLISH.log.
  PUBLISH_REPO=slug Default: the origin remote's owner/name.

Exit status:
  0  Published, replaced, skipped as identical, owner-gated, or a dry-run
     whose gate passed.
  1  Refused or failed. Fail closed: nothing is uploaded when the gate is not
     proven.
EOF
}

# --- guards ----------------------------------------------------------------

# is_patch_tag <tag> — the live rule: v0.0.<n> and nothing else. No prerelease
# suffix, no build metadata, no two-digit minor, no major.
is_patch_tag() {
    [[ "${1:-}" =~ ^v0\.0\.[0-9]+$ ]]
}

# is_dryrun_tag <tag> — a local probe tag. Only a dry-run may carry it, and the
# base version must itself satisfy the live rule, so the probe exercises the
# same version shape a real patch release has.
is_dryrun_tag() {
    [[ "${1:-}" =~ ^v0\.0\.[0-9]+-dryrun\.[0-9A-Za-z]+(\.[0-9A-Za-z]+)*$ ]]
}

# --- idempotency -----------------------------------------------------------

# decide_action <existing-assets-json> <asset-name> <sha256-hex>
# Prints one of: upload | skip-identical | replace.
#
# One asset name per release is the invariant. An identical asset (name and
# sha256) is skipped. A same-named asset with different bytes is replaced, so a
# re-run never leaves two copies of the same artifact behind.
decide_action() {
    EXISTING_JSON="${1:-}" ASSET_NAME="${2:-}" ASSET_SHA="${3:-}" node -e '
        const existing = process.env.EXISTING_JSON || "";
        const name = process.env.ASSET_NAME || "";
        const sha = process.env.ASSET_SHA || "";
        let assets = [];
        try {
            const parsed = JSON.parse(existing || "{\"assets\":[]}");
            assets = Array.isArray(parsed.assets) ? parsed.assets : [];
        } catch {
            console.log("replace");
            process.exit(0);
        }
        const hit = assets.find((a) => a && a.name === name);
        if (!hit) { console.log("upload"); process.exit(0); }
        const digest = typeof hit.digest === "string" ? hit.digest : "";
        if (digest === "sha256:" + sha) { console.log("skip-identical"); process.exit(0); }
        console.log("replace");
    '
}

# --- audit -----------------------------------------------------------------

# audit_line <version> <commit> <timestamp> <artifacts> <channels> <result>
audit_line() {
    printf '%s | %s | %s | %s | %s | %s\n' "$1" "$2" "$3" "$4" "$5" "$6"
}

# write_audit <line> — append to the audit log, seeding the schema header on
# first use, and echo the line so the caller and the CI log both carry it.
write_audit() {
    local line="$1"
    mkdir -p "$(dirname "$AUDIT_LOG")"
    if [ ! -f "$AUDIT_LOG" ]; then
        {
            printf '%s\n' '# AUTO-PUBLISH.log — one machine-readable line per auto-publish run.'
            printf '%s\n' '# Fields, in order: version | commit | timestamp (UTC) | artifacts | channels | result'
            printf '%s\n' '# result carries the gate verdict as a subfield: result=<verdict>;gate=<verdict>'
            printf '%s\n' '# Written by scripts/auto-publish.sh and .github/workflows/auto-publish.yml.'
        } >> "$AUDIT_LOG"
    fi
    printf '%s\n' "$line" >> "$AUDIT_LOG"
    printf '%s\n' "$line"
    if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
        # shellcheck disable=SC2016 # the backtick fences are literal Markdown
        printf '```text\n%s\n```\n' "$line" >> "$GITHUB_STEP_SUMMARY"
    fi
}

# --- gate: the mission's own record ----------------------------------------

# ci_runs_verdict <workflow-runs-json> — the pure decision over a runs payload.
# Prints pass:... | failing:... | no-ci-run | unparseable. Exit 0 only on pass.
# Kept separate from the API call so the decision itself is testable offline.
ci_runs_verdict() {
    RUNS_JSON="${1:-}" node -e '
        const raw = process.env.RUNS_JSON || "";
        let parsed;
        try { parsed = JSON.parse(raw); } catch { console.log("unparseable"); process.exit(1); }
        const all = Array.isArray(parsed.workflow_runs) ? parsed.workflow_runs : [];
        const runs = all.filter((r) => typeof r.path === "string" && r.path.endsWith("/ci.yml"));
        if (runs.length === 0) { console.log("no-ci-run"); process.exit(1); }
        const bad = runs.filter((r) => r.status !== "completed" || r.conclusion !== "success");
        if (bad.length > 0) {
            console.log("failing:" + bad.map((r) => "run" + r.run_number + "=" + r.status + "/" + r.conclusion).join(","));
            process.exit(1);
        }
        console.log("pass:" + runs.length + "-ci-run(s)(run" + runs.map((r) => r.run_number).join(",run") + ")");
        process.exit(0);
    '
}

# ci_evidence <commit-sha> — the mission's gate record for that exact commit.
#
# It reads the `ci` workflow's runs for the commit, not every check run in the
# repository: the auto-publish workflow's own jobs also create check runs on
# that commit, and counting them would make every live run fail its own gate.
# At least one `ci` run must exist, and every `ci` run for the commit must be
# completed and successful. Prints a detail string; exit 0 only on proof.
ci_evidence() {
    local sha="$1" json err_file detail rc
    if ! command -v gh > /dev/null 2>&1; then
        printf 'gh-absent'
        return 1
    fi
    err_file="$(mktemp)"
    if ! json="$(gh api "repos/${PUBLISH_REPO}/actions/runs?head_sha=${sha}&per_page=100" 2>"$err_file")"; then
        if grep -qi 'rate limit' "$err_file" 2>/dev/null; then
            printf 'rate-limited'
        else
            printf 'api-unavailable'
        fi
        rm -f "$err_file"
        return 1
    fi
    rm -f "$err_file"
    detail="$(ci_runs_verdict "$json")"
    rc=$?
    if [ "$rc" -ne 0 ] && [ "$detail" = "no-ci-run" ]; then
        # Distinguish "CI never ran" from "this commit was never pushed": both
        # fail closed, and the owner needs to know which one to fix.
        if ! gh api "repos/${PUBLISH_REPO}/commits/${sha}" > /dev/null 2>&1; then
            detail="commit-unknown-on-remote"
        fi
    fi
    printf '%s' "$detail"
    return "$rc"
}

# --- gate: the battery at the exact tagged tree -----------------------------

# battery <tree> <logs> — run the repository's named checks against the
# extracted tree at the tagged commit. Prints one PASS(label) or FAIL(label)
# line per check; exit non-zero when any check failed or could not be run.
battery() {
    local tree="$1" logs="$2" status=0
    local tsc_bin=""

    if ! command -v node > /dev/null 2>&1; then
        printf 'FAIL(node:absent)\n'
        return 1
    fi

    if ( cd "$tree" && node scripts/generate-catalog-json.mjs --check ) > "${logs}/generate-catalog.log" 2>&1; then
        printf 'PASS(generate-catalog)\n'
    else
        printf 'FAIL(generate-catalog)\n'
        tail -n 6 "${logs}/generate-catalog.log" >&2
        status=1
    fi

    if ( cd "$tree" && node scripts/verify-registry.mjs ) > "${logs}/verify-registry.log" 2>&1; then
        printf 'PASS(verify-registry)\n'
    else
        printf 'FAIL(verify-registry)\n'
        tail -n 6 "${logs}/verify-registry.log" >&2
        status=1
    fi

    if [ ! -f "${tree}/scripts/verify-skills.mjs" ]; then
        printf 'FAIL(verify-skills:absent)\n'
        status=1
    elif ( cd "$tree" && node scripts/verify-skills.mjs ) > "${logs}/verify-skills.log" 2>&1; then
        printf 'PASS(verify-skills)\n'
    else
        printf 'FAIL(verify-skills)\n'
        tail -n 6 "${logs}/verify-skills.log" >&2
        status=1
    fi

    # Absent is a failure here, not a notice: a publish gate may not read a
    # skipped check as a passing one.
    if [ ! -f "${tree}/scripts/verify-kit.mjs" ]; then
        printf 'FAIL(verify-kit:absent)\n'
        status=1
    elif ( cd "$tree" && node scripts/verify-kit.mjs ) > "${logs}/verify-kit.log" 2>&1; then
        printf 'PASS(verify-kit)\n'
    else
        printf 'FAIL(verify-kit)\n'
        tail -n 6 "${logs}/verify-kit.log" >&2
        status=1
    fi

    if [ ! -f "${tree}/tsconfig.json" ]; then
        printf 'FAIL(tsc:tsconfig-absent)\n'
        status=1
    else
        if [ -x "${REPO_ROOT}/node_modules/.bin/tsc" ]; then
            tsc_bin="${REPO_ROOT}/node_modules/.bin/tsc"
        fi
        if [ -n "$tsc_bin" ]; then
            if ( cd "$tree" && "$tsc_bin" --noEmit -p tsconfig.json ) > "${logs}/tsc.log" 2>&1; then
                printf 'PASS(tsc)\n'
            else
                printf 'FAIL(tsc)\n'
                tail -n 6 "${logs}/tsc.log" >&2
                status=1
            fi
        elif ( cd "$tree" && npx --yes -p typescript@5 tsc --noEmit -p tsconfig.json ) > "${logs}/tsc.log" 2>&1; then
            printf 'PASS(tsc)\n'
        else
            printf 'FAIL(tsc:unavailable)\n'
            tail -n 6 "${logs}/tsc.log" >&2
            status=1
        fi
    fi

    return "$status"
}

# --- self-test --------------------------------------------------------------

self_test() {
    local failures=0 case_name want got rc=0
    local -a tags_yes=("v0.0.1" "v0.0.10" "v0.0.0")
    local -a tags_no=("v0.1.0" "v1.0.0" "v0.0.1-rc1" "v0.0.1.1" "v0.0.x" "0.0.1" "v0.0.1-dryrun.1")
    local -a probe_yes=("v0.0.99-dryrun.1" "v0.0.7-dryrun.2")
    local -a probe_no=("v0.0.99" "v0.1.0-dryrun.1" "v1.0.0-dryrun.1" "v0.0.99-other.1")

    for case_name in "${tags_yes[@]}"; do
        is_patch_tag "$case_name" || { log_error "guard: ${case_name} should pass the live rule"; failures=$((failures + 1)); }
    done
    for case_name in "${tags_no[@]}"; do
        if is_patch_tag "$case_name"; then log_error "guard: ${case_name} must not pass the live rule"; failures=$((failures + 1)); fi
    done
    for case_name in "${probe_yes[@]}"; do
        is_dryrun_tag "$case_name" || { log_error "probe guard: ${case_name} should pass"; failures=$((failures + 1)); }
    done
    for case_name in "${probe_no[@]}"; do
        if is_dryrun_tag "$case_name"; then log_error "probe guard: ${case_name} must not pass"; failures=$((failures + 1)); fi
    done

    # Idempotency: one asset name, proven by name+sha256.
    want=upload
    got="$(decide_action '{"assets":[]}' "a.tar.gz" "abc")"
    [ "$got" = "$want" ] || { log_error "idempotency: empty release expected ${want}, got ${got}"; failures=$((failures + 1)); }
    want=skip-identical
    got="$(decide_action '{"assets":[{"name":"a.tar.gz","digest":"sha256:abc"}]}' "a.tar.gz" "abc")"
    [ "$got" = "$want" ] || { log_error "idempotency: identical expected ${want}, got ${got}"; failures=$((failures + 1)); }
    want=replace
    got="$(decide_action '{"assets":[{"name":"a.tar.gz","digest":"sha256:def"}]}' "a.tar.gz" "abc")"
    [ "$got" = "$want" ] || { log_error "idempotency: different digest expected ${want}, got ${got}"; failures=$((failures + 1)); }
    want=replace
    got="$(decide_action '{"assets":[{"name":"a.tar.gz"}]}' "a.tar.gz" "abc")"
    [ "$got" = "$want" ] || { log_error "idempotency: missing digest expected ${want}, got ${got}"; failures=$((failures + 1)); }

    # CI evidence: the auto-publish workflow's own job must never count as a
    # failing check on the commit it is gate-keeping, and a commit with no ci
    # run must never pass.
    got="$(ci_runs_verdict '{"workflow_runs":[{"path":".github/workflows/auto-publish.yml","status":"in_progress","conclusion":null}]}')"
    rc=$?
    { [ "$got" = "no-ci-run" ] && [ "$rc" -eq 1 ]; } || { log_error "ci evidence: own-workflow-only expected no-ci-run/1, got ${got}/${rc}"; failures=$((failures + 1)); }
    got="$(ci_runs_verdict '{"workflow_runs":[{"path":".github/workflows/ci.yml","status":"completed","conclusion":"success","run_number":34},{"path":".github/workflows/auto-publish.yml","status":"in_progress","conclusion":null}]}')"
    rc=$?
    { [ "$rc" -eq 0 ] && [ "${got#pass:}" != "$got" ]; } || { log_error "ci evidence: green ci run expected PASS, got ${got}/${rc}"; failures=$((failures + 1)); }
    got="$(ci_runs_verdict '{"workflow_runs":[{"path":".github/workflows/ci.yml","status":"completed","conclusion":"failure","run_number":35}]}')"
    rc=$?
    { [ "$rc" -eq 1 ] && [ "$got" = "failing:run35=completed/failure" ]; } || { log_error "ci evidence: failing ci run expected failing/1, got ${got}/${rc}"; failures=$((failures + 1)); }

    # Audit line: exactly six pipe-separated fields.
    got="$(audit_line "v0.0.1" "abc123" "2026-10-21T00:00:00Z" "a.tar.gz sha256:abc bytes=1" "github-release:o/r,git-tag:v0.0.1" "dry-run-would-publish;gate=PASS" | awk -F' \\| ' '{print NF}')"
    [ "$got" = "6" ] || { log_error "audit: expected 6 fields, got ${got}"; failures=$((failures + 1)); }

    if [ "$failures" -ne 0 ]; then
        log_error "self-test FAILED (${failures} assertion(s))"
        return 1
    fi
    log "self-test PASS: guard, idempotency and audit-line assertions all held"
    return 0
}

# --- main -------------------------------------------------------------------

main() {
    local tag="" self_test_only=0
    local sha="" ts="" tmp=""
    local artifact="" artifact_sha="" artifact_bytes="" artifact_desc=""
    local channels="" assets_json="" action="" result="" gate="" gate_failures=""
    local ci_detail="" battery_out="" battery_rc=0 line label=""
    local -a failed=()

    while [ $# -gt 0 ]; do
        case "$1" in
            -h | --help) usage; exit 0 ;;
            --self-test) self_test_only=1; shift ;;
            *)
                if [ -z "$tag" ]; then
                    tag="$1"
                else
                    log_error "unexpected argument: $1"
                    usage >&2
                    exit 1
                fi
                shift
                ;;
        esac
    done

    if [ "$self_test_only" -eq 1 ]; then
        self_test
        exit $?
    fi

    if ! command -v git > /dev/null 2>&1; then
        log_error 'git is absent; the tagged commit cannot be resolved.'
        exit 1
    fi

    # 1. Repository slug and tag.
    PUBLISH_REPO="${PUBLISH_REPO:-$(git -C "$REPO_ROOT" remote get-url origin 2>/dev/null | sed -E 's#.*github\.com[/:]##; s#\.git$##')}"
    if [ -z "$PUBLISH_REPO" ]; then
        log_error 'cannot resolve the repository slug; set PUBLISH_REPO=owner/name.'
        exit 1
    fi

    if [ -z "$tag" ]; then
        tag="$(git -C "$REPO_ROOT" describe --tags --abbrev=0 2>/dev/null)"
        if [ -z "$tag" ]; then
            log_error 'no tag given and no tag reachable from HEAD.'
            exit 1
        fi
        log "no tag given; using the newest reachable tag: ${tag}"
    fi

    ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    channels="github-release:${PUBLISH_REPO},git-tag:${tag}"

    # 2. Tag guard. A tag outside the patch shape never publishes, and that is
    #    not a failure: minor and major releases are owner decisions.
    if is_patch_tag "$tag"; then
        :
    elif [ "$DRY_RUN" = "1" ] && is_dryrun_tag "$tag" && is_patch_tag "${tag%%-dryrun*}"; then
        log "dry-run tag ${tag}: the live rule would accept its base ${tag%%-dryrun*}"
    else
        printf '::notice title=owner-gated::%s is not a v0.0.x patch release; minor and major releases stay owner-gated. Nothing was published.\n' "$tag"
        write_audit "$(audit_line "$tag" "-" "$ts" "none" "$channels" "owner-gated;gate=not-evaluated")"
        exit 0
    fi

    # 3. The exact commit. The artifact is built from the tag, never from a
    #    worktree, so uncommitted local state can never reach a release.
    if ! git -C "$REPO_ROOT" rev-parse -q --verify "refs/tags/${tag}" > /dev/null; then
        log_error "tag ${tag} does not exist locally."
        exit 1
    fi
    sha="$(git -C "$REPO_ROOT" rev-parse "${tag}^{commit}")"
    log "tag ${tag} -> commit ${sha}"

    # 4. Every packaged path must exist at that commit, exactly as release.yml
    #    demands. A missing path fails the run before an artifact is built.
    local p missing=""
    for p in "${PACKAGE_PATHS[@]}"; do
        git -C "$REPO_ROOT" cat-file -e "${sha}:${p}" 2>/dev/null || missing="${missing} ${p}"
    done
    if [ -n "$missing" ]; then
        log_error "packaged path(s) absent at ${tag}:${missing}"
        exit 1
    fi

    # 5. Build from the exact tagged commit. git archive is deterministic for a
    #    commit, so a re-run rebuilds identical bytes and identity is provable.
    tmp="$(mktemp -d)"
    trap 'rm -rf "${tmp:-}"' EXIT
    artifact="vantrilex-arsenal-${tag}.tar.gz"
    if ! git -C "$REPO_ROOT" archive --format=tar.gz --output="${tmp}/${artifact}" "$sha" -- "${PACKAGE_PATHS[@]}"; then
        log_error 'git archive failed; nothing was built.'
        exit 1
    fi
    artifact_sha="$(sha256sum "${tmp}/${artifact}" | awk '{print $1}')"
    artifact_bytes="$(wc -c < "${tmp}/${artifact}" | tr -d ' ')"
    artifact_desc="${artifact} sha256=${artifact_sha} bytes=${artifact_bytes}"
    log "built ${artifact} (${artifact_bytes} bytes, sha256 ${artifact_sha})"

    # 6. Gate. Two proofs, both required, both always evaluated so one refusal
    #    names every failing check instead of the first.
    if ci_detail="$(ci_evidence "$sha")"; then
        log "gate: CI evidence PASS — ${ci_detail}"
    else
        log_error "gate: CI evidence FAIL — ${ci_detail}"
        failed+=("ci-evidence:${ci_detail}")
    fi

    mkdir -p "${tmp}/tree" "${tmp}/logs"
    if ! git -C "$REPO_ROOT" archive --format=tar --output="${tmp}/tree.tar" "$sha"; then
        log_error 'cannot extract the tagged tree for the battery; gate unproven.'
        exit 1
    fi
    tar -xf "${tmp}/tree.tar" -C "${tmp}/tree"
    battery_out="$(battery "${tmp}/tree" "${tmp}/logs")"
    battery_rc=$?
    printf '%s\n' "$battery_out" | sed 's/^/[auto-publish] battery: /'
    if [ "$battery_rc" -ne 0 ]; then
        while IFS= read -r line; do
            case "$line" in
                FAIL*)
                    label="${line#FAIL(}"
                    label="${label%)}"
                    failed+=("battery:${label}")
                    ;;
            esac
        done <<EOF
${battery_out}
EOF
    fi

    if [ "${#failed[@]}" -eq 0 ]; then
        gate="PASS"
    else
        gate="FAIL"
        gate_failures="$(printf '%s ' "${failed[@]}" | sed -E 's/[[:space:]]+$//')"
    fi

    if [ "$gate" != "PASS" ]; then
        result="refused-verification;gate=FAIL(${gate_failures})"
        log_error "gate not proven — nothing uploaded: ${gate_failures}"
        write_audit "$(audit_line "$tag" "$sha" "$ts" "$artifact_desc" "$channels" "$result")"
        exit 1
    fi
    log "gate PASS"

    # 7. Existing assets for idempotency. A release the event called published
    #    but the API cannot see is a refusal in a live run.
    if assets_json="$(gh release view "$tag" --json assets 2>/dev/null)"; then
        log "release ${tag} found; existing assets: $(printf '%s' "$assets_json" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log((j.assets||[]).map(a=>a.name).join(",")||"none")})')"
    else
        assets_json='{"assets":[]}'
        if [ "$DRY_RUN" != "1" ]; then
            log_error "release ${tag} is not visible to the API; refusing to publish into an unknown release."
            write_audit "$(audit_line "$tag" "$sha" "$ts" "$artifact_desc" "$channels" "refused-release-absent;gate=PASS")"
            exit 1
        fi
        log "release ${tag} not found (expected for a local dry-run tag); treating assets as none"
    fi

    action="$(decide_action "$assets_json" "$artifact" "$artifact_sha")"
    log "idempotency decision for ${artifact}: ${action}"

    # 8. Publish, or report exactly what publishing would do.
    if [ "$DRY_RUN" = "1" ]; then
        printf '%s\n' "[auto-publish] DRY RUN (DRY_RUN=1) — nothing is uploaded, no release is changed."
        printf '%s\n' "[auto-publish]   artifact : ${artifact} (${artifact_bytes} bytes, sha256 ${artifact_sha})"
        printf '%s\n' "[auto-publish]   channel  : github-release:${PUBLISH_REPO} — would ${action} ${artifact}"
        printf '%s\n' "[auto-publish]   channel  : git-tag:refs/tags/${tag} — already published at ${sha}, no upload step"
        if [ "$action" != "skip-identical" ]; then
            printf '%s\n' "[auto-publish]   latest   : release would be marked latest"
        fi
        result="dry-run-would-publish;gate=PASS;action=${action}"
        write_audit "$(audit_line "$tag" "$sha" "$ts" "$artifact_desc" "$channels" "$result")"
        exit 0
    fi

    case "$action" in
        skip-identical)
            result="skipped-identical;gate=PASS"
            log "identical asset already attached; upload skipped, no duplicate created"
            ;;
        replace)
            if ! gh release upload "$tag" "${tmp}/${artifact}" --clobber; then
                result="failed-upload;gate=PASS"
                write_audit "$(audit_line "$tag" "$sha" "$ts" "$artifact_desc" "$channels" "$result")"
                exit 1
            fi
            result="replaced;gate=PASS"
            ;;
        upload)
            if ! gh release upload "$tag" "${tmp}/${artifact}"; then
                result="failed-upload;gate=PASS"
                write_audit "$(audit_line "$tag" "$sha" "$ts" "$artifact_desc" "$channels" "$result")"
                exit 1
            fi
            result="published;gate=PASS"
            ;;
        *)
            log_error "unknown idempotency decision: ${action}"
            exit 1
            ;;
    esac

    if gh release edit "$tag" --latest > /dev/null 2>&1; then
        result="${result};latest=PASS"
    else
        result="${result};latest=FAIL"
        log_error "asset handled but marking ${tag} latest failed."
        write_audit "$(audit_line "$tag" "$sha" "$ts" "$artifact_desc" "$channels" "$result")"
        exit 1
    fi

    write_audit "$(audit_line "$tag" "$sha" "$ts" "$artifact_desc" "$channels" "$result")"
    log "done: ${result}"
    exit 0
}

main "$@"
