#!/usr/bin/env bash
#
# record-decision.sh — append one Architecture Decision Record.
#
# Every autonomous trade-off stays auditable by landing in the project's
# architecture decision record. The target document is auto-detected so a
# layout change needs no edit here:
#   docs/03-architecture/13-ARCHITECTURE-DECISION-RECORD.md   canonical
# When it does not exist, the directory and a standard header are created, so
# the first decision can be recorded without a manual step.
#
# Records are append-only: existing entries are never reordered or rewritten.
#
# Usage:
#   ./scripts/record-decision.sh <TITLE> [--status accepted|proposed|superseded]
#                               [--context TEXT] [--decision TEXT]
#                               [--consequences TEXT] [-h | --help]
#
# Exit status:
#   0 — the record was appended (or the log created with its header)
#   1 — refused: missing title, invalid status, or unwritable decision log

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

DECISION_LOG="docs/03-architecture/13-ARCHITECTURE-DECISION-RECORD.md"

log_info() { printf '[decide] %s\n' "$*"; }
log_error() { printf '[decide] ERROR: %s\n' "$*" >&2; }

usage() {
    cat <<EOF
record-decision.sh — append one ADR to the decision log (auto-detected).

Usage:
  ./scripts/record-decision.sh <TITLE> [--status accepted|proposed|superseded]
                               [--context TEXT] [--decision TEXT]
                               [--consequences TEXT]

  TITLE          short imperative name of the decision (required).
  --status       record state; default: proposed.
  --context      the forces in play; why a decision was needed at all.
  --decision     what was chosen.
  --consequences what becomes easier, what becomes harder, what is now binding.

Exit status:
  0    Record appended.
  1    Missing title, invalid status, or unwritable decision log.
EOF
}

detect_decision_log() {
    # Auto-detect the decision log, creating the canonical file on first use.
    local candidate="${REPO_ROOT}/${DECISION_LOG}"
    local dir
    dir="$(dirname "$candidate")"

    if [ -f "$candidate" ]; then
        printf '%s' "$candidate"
        return 0
    fi

    mkdir -p "$dir" || return 1
    {
        printf '# Architecture Decision Record\n\n'
        printf 'Architecture Decision Records: context, options considered, outcome, and consequences.\n'
        printf 'Entries are appended by scripts/record-decision.sh, are append-only, and are never reordered.\n'
    } > "$candidate" || return 1
    printf '%s' "$candidate"
}

next_adr_number() {
    # next_adr_number <doc> — count existing records; numbering is append-only.
    local count
    count="$(grep -cE '^## ADR-[0-9]+' "$1" 2> /dev/null || true)"
    printf 'ADR-%03d' "$((count + 1))"
}

main() {
    local title="" status="proposed" context="" decision="" consequences=""
    local doc adr

    while [ $# -gt 0 ]; do
        case "$1" in
            -h | --help) usage; exit 0 ;;
            --status) status="${2:-}"; shift 2 ;;
            --context) context="${2:-}"; shift 2 ;;
            --decision) decision="${2:-}"; shift 2 ;;
            --consequences) consequences="${2:-}"; shift 2 ;;
            *)
                if [ -z "$title" ]; then
                    title="$1"
                else
                    log_error "unexpected argument: $1"
                    usage >&2
                    exit 1
                fi
                shift
                ;;
        esac
    done

    if [ -z "$title" ]; then
        log_error 'a decision TITLE is required.'
        usage >&2
        exit 1
    fi

    case "$status" in
        accepted | proposed | superseded) ;;
        *)
            log_error "invalid --status '$status' (accepted, proposed, superseded)."
            exit 1
            ;;
    esac

    doc="$(detect_decision_log)" || {
        log_error "cannot create the decision log at ${DECISION_LOG}."
        exit 1
    }
    adr="$(next_adr_number "$doc")"

    {
        printf '\n## %s: %s\n\n' "$adr" "$title"
        printf -- '- **Date:** %s\n' "$(date +%Y-%m-%d)"
        printf -- '- **Status:** %s\n\n' "$status"
        printf '### Context\n\n%s\n\n' "${context:-(fill in before sign-off)}"
        printf '### Decision\n\n%s\n\n' "${decision:-(fill in before sign-off)}"
        printf '### Consequences\n\n%s\n' "${consequences:-(fill in before sign-off)}"
    } >> "$doc"

    log_info "$adr recorded in ${doc#"$REPO_ROOT"/}: $title"
    exit 0
}

main "$@"
