#!/usr/bin/env bash
#
# dispatch-worktrees.sh — one isolated git worktree per concern.
#
# Provisions a worktree for a single concern on branch wt/<concern-slug>, then
# injects that lifecycle phase's component kit into the worktree and drops a
# briefing so a sub-agent can start work without a confirmation round-trip.
# One concern per branch is the repository law, so a worktree carries exactly
# one.
#
# Checkpoint schema — docs/17-CHECKPOINT.md
# ------------------------------------------
# The checkpoint is a living state file, not a milestone DAG. It is read as
# labeled lines, matching the convention the Arsenal plugin already parses in
# docs/00-PROJECT-SUMMARY.md and docs/25-AI-CONSTITUTION.md:
#
#     **Label:** value        or        Label: value
#
# optionally indented or bulleted. The fields this script consumes:
#
#   Status:    ACTIVE | BLOCKED     Required. BLOCKED means the 3-strike
#                                  circuit breaker has halted the session and a
#                                  Diagnostic Incident Report is unresolved.
#   Phase:     scout | docs | plan | build | review | operate
#                                  Required when PHASE is not given. Drives
#                                  which components orchestrate-stage.sh
#                                  injects. Vocabulary matches the `phase`
#                                  enum in registry/schema/catalog-v2.schema.json.
#   Concern:   <kebab-slug>         Required when CONCERN_SLUG is not given.
#                                  Becomes the worktree name and the branch
#                                  suffix, so it must satisfy the same
#                                  kebab-case rule as an explicit argument.
#
# Fields the circuit-breaker skill also records, read here only for operator
# guidance: Defect: DEF-<NNN> and Released: <semver>.
#
# Refuses to run when:
#   - Status is BLOCKED (the circuit breaker owns the session),
#   - the concern slug is unsafe, or already dispatched,
#   - the index has staged changes (a worktree branches from HEAD; uncommitted
#     state must never cross a worktree boundary).
#
# Usage:
#   ./scripts/dispatch-worktrees.sh <CONCERN_SLUG> [PHASE]
#
#   CONCERN_SLUG  kebab-case identifier, e.g. "registry-phase-backfill"
#                 (default when omitted: the checkpoint's Concern field)
#   PHASE         lifecycle phase for kit injection; one of scout, docs, plan,
#                 build, review, operate (default: the checkpoint's Phase)
#
# Exit status:
#   0 — worktree provisioned and the phase kit injected
#   1 — refused on purpose (see above), or injection failed entirely

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
CHECKPOINT="${REPO_ROOT}/docs/17-CHECKPOINT.md"
WORKTREE_ROOT="${REPO_ROOT}/.worktrees"

VALID_PHASES="scout docs plan build review operate"

log_info() { printf '[dispatch] %s\n' "$*"; }
log_error() { printf '[dispatch] ERROR: %s\n' "$*" >&2; }

usage() {
    cat <<EOF
dispatch-worktrees.sh — provision an isolated git worktree for one concern,
with that lifecycle phase's component kit pre-injected.

Usage:
  ./scripts/dispatch-worktrees.sh <CONCERN_SLUG> [PHASE]

Examples:
  ./scripts/dispatch-worktrees.sh registry-phase-backfill
  ./scripts/dispatch-worktrees.sh kit-lock-schema build

Omitting CONCERN_SLUG takes the checkpoint's Concern field; omitting PHASE
takes the checkpoint's Phase field.

Phases:
  ${VALID_PHASES// /, }

Exit status:
  0    Worktree ready at .worktrees/<concern> on branch wt/<concern>.
  1    Refused (BLOCKED checkpoint, dirty index, bad slug, duplicate dispatch)
       or kit injection failed.
EOF
}

read_checkpoint_field() {
    # The bold markers sit on either side of the colon in either convention
    # ("**Label:** v" and "**Label**: v"), and the label itself may be bulleted
    # or indented, so both are tolerated rather than pinning one writer format.
    sed -n -E "s/^[[:space:]]*[-*]?[[:space:]]*(\*\*)?$1[[:space:]]*(\*\*)?[[:space:]]*:[[:space:]]*(\*\*)?[[:space:]]*//Ip" \
        "$CHECKPOINT" 2> /dev/null | head -n 1
}

is_valid_phase() {
    local candidate="$1" phase
    for phase in $VALID_PHASES; do
        [ "$candidate" = "$phase" ] && return 0
    done
    return 1
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

write_briefing() {
    # write_briefing <worktree_dir> <concern> <phase>
    # Lives under .opencode/ so the worktree stays pristine for automatic
    # pruning at merge time: a dirty worktree cannot be removed without force.
    mkdir -p "$1/.opencode"
    cat >"$1/.opencode/STREAM.md" <<EOF
# Concern: $2 (phase $3)

Sub-agent briefing — begin work on this single concern without asking for
confirmation.

## Read First
- docs/17-CHECKPOINT.md — mission, phase, status, standing rules.
- AGENTS.md — engineering law; the seven hard rules bind here.

## Boundary Contract
- One concern per worktree. Do not edit outside this worktree.
- The component kit for phase $3 is already injected under .opencode/.
- Integrate only via: bash scripts/merge-worktrees.sh $2
EOF
}

main() {
    local concern="${1:-}"
    local raw_phase="${2:-}"
    local phase status wt branch

    if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
        usage
        exit 0
    fi

    if ! command -v git > /dev/null 2>&1; then
        log_error 'git is not available on PATH.'
        exit 1
    fi

    if [ ! -f "$CHECKPOINT" ]; then
        log_error "no checkpoint at ${CHECKPOINT#"$REPO_ROOT"/}; cannot read status or phase."
        exit 1
    fi

    status="$(read_checkpoint_field 'Status')"
    if [ "$status" = 'BLOCKED' ]; then
        log_error 'checkpoint Status is BLOCKED; the circuit breaker owns this session.'
        log_error 'resolve the Diagnostic Incident Report recorded in docs/17-CHECKPOINT.md first.'
        log_error 'the halt clears only on a Guide-approved changed hypothesis.'
        exit 1
    fi

    if [ -z "$concern" ]; then
        concern="$(read_checkpoint_field 'Concern')"
        if [ -z "$concern" ]; then
            log_error 'no CONCERN_SLUG given and the checkpoint has no Concern field.'
            usage >&2
            exit 1
        fi
        log_info "no concern given; using the checkpoint's Concern field: '$concern'"
    fi

    validate_concern_slug "$concern" || exit 1

    if [ -n "$raw_phase" ]; then
        phase="$raw_phase"
    else
        phase="$(read_checkpoint_field 'Phase')"
    fi
    if ! is_valid_phase "$phase"; then
        log_error "PHASE must be one of: ${VALID_PHASES// /, } (got: '${phase:-empty}')."
        log_error "set it as the second argument, or as the Phase field in the checkpoint."
        exit 1
    fi

    if [ -n "$(git -C "$REPO_ROOT" diff --cached --name-only)" ]; then
        log_error 'staged changes detected; commit or stash before dispatching.'
        log_error 'uncommitted state never crosses a worktree boundary.'
        exit 1
    fi

    wt="${WORKTREE_ROOT}/${concern}"
    branch="wt/${concern}"

    if [ -d "$wt" ] || git -C "$REPO_ROOT" worktree list --porcelain | grep -qF "$wt"; then
        log_error "concern already dispatched: $wt"
        exit 1
    fi

    mkdir -p "$WORKTREE_ROOT"
    if ! git -C "$REPO_ROOT" worktree add -b "$branch" "$wt"; then
        log_error "git worktree add failed for $branch -> $wt"
        exit 1
    fi

    # The worktree is a full checkout carrying its own copy of these scripts, so
    # injection runs against the worktree root.
    if ! (cd "$wt" && bash scripts/orchestrate-stage.sh "$phase"); then
        log_error "kit injection failed inside $wt; removing the worktree."
        git -C "$REPO_ROOT" worktree remove --force "$wt"
        git -C "$REPO_ROOT" branch -D "$branch" > /dev/null 2>&1 || true
        exit 1
    fi

    write_briefing "$wt" "$concern" "$phase"

    log_info "concern '$concern' ready:"
    log_info "  worktree : $wt"
    log_info "  branch   : $branch"
    log_info "  phase    : $phase"
    log_info "integrate with: bash scripts/merge-worktrees.sh $concern"
    exit 0
}

main "$@"
