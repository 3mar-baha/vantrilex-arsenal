#!/usr/bin/env bash
#
# teardown-stage.sh — clear everything a phase session accumulated.
#
# Removes:
#   - .opencode/kit/            injected component records for the active phase
#   - .opencode/STREAM.md       concern briefing written by dispatch-worktrees.sh
#   - .opencode/hooks/stage-*.sh  ephemeral stage hooks
#   - .opencode/.strike_tracker circuit-breaker strike state
#   - .opencode/spec-index.md   spec ingestion index
#   - an empty .worktrees/      left behind after every concern was pruned
#
# It never touches project code, registry data, documentation, or the shipped
# .opencode/plugin, .opencode/command, .opencode/skills, or .opencode/agent
# trees. Safe to run repeatedly and from any directory.
#
# Usage:
#   ./scripts/teardown-stage.sh [-h | --help]
#
# Exit status:
#   0 — teardown completed (nothing to remove counts as success)
#   1 — a target survived removal

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

AGENT_HOME="${REPO_ROOT}/.opencode"

log_info() { printf '[teardown] %s\n' "$*"; }
log_warn() { printf '[teardown] WARN: %s\n' "$*" >&2; }
log_error() { printf '[teardown] ERROR: %s\n' "$*" >&2; }

usage() {
    cat <<'EOF'
teardown-stage.sh — clear injected components, the concern briefing, ephemeral
stage hooks, and circuit-breaker strike state.

Usage:
  ./scripts/teardown-stage.sh

Exit status:
  0    Teardown completed, or there was nothing to clean.
  1    A target could not be removed.
EOF
}

remove_tree() {
    # remove_tree <path> — reports honestly instead of assuming success.
    local target="$1"
    [ -e "$target" ] || return 0

    rm -rf "$target" 2> /dev/null || true
    if [ -e "$target" ]; then
        sleep 1
        rm -rf "$target" 2> /dev/null || true
    fi
    # A freshly copied tree can lose its children yet resist the final rmdir
    # for a moment; fall back to the native remover before admitting defeat.
    if [ -e "$target" ] && command -v cmd > /dev/null 2>&1 && command -v cygpath > /dev/null 2>&1; then
        cmd //c "rmdir /s /q $(cygpath -w "$target")" > /dev/null 2>&1 || true
    fi

    if [ -e "$target" ]; then
        log_warn "could not fully remove ${target#"$REPO_ROOT"/}; a process may still hold it"
        return 1
    fi
    log_info "removed ${target#"$REPO_ROOT"/}"
    return 0
}

remove_file() {
    local target="$1"
    [ -e "$target" ] || return 0
    rm -f "$target" || {
        log_error "could not remove ${target#"$REPO_ROOT"/}"
        return 1
    }
    log_info "removed ${target#"$REPO_ROOT"/}"
    return 0
}

main() {
    local removed=0
    local incomplete=0

    if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
        usage
        exit 0
    fi

    remove_tree "${AGENT_HOME}/kit" || incomplete=1
    remove_file "${AGENT_HOME}/STREAM.md" || incomplete=1
    remove_file "${AGENT_HOME}/spec-index.md" || incomplete=1
    remove_file "${AGENT_HOME}/.strike_tracker" || incomplete=1

    if compgen -G "${AGENT_HOME}/hooks/stage-*.sh" > /dev/null; then
        rm -f "${AGENT_HOME}/hooks/stage-"*.sh || incomplete=1
        removed=$((removed + 1))
        log_info 'removed ephemeral stage hooks'
    fi

    # A non-empty worktree root holds possibly uncommitted concern work, so it
    # is only cleared once every concern has been pruned.
    if [ -d "${REPO_ROOT}/.worktrees" ] && [ -z "$(ls -A "${REPO_ROOT}/.worktrees" 2> /dev/null)" ]; then
        rmdir "${REPO_ROOT}/.worktrees" && log_info 'removed empty .worktrees/ directory'
    fi

    removed=$((removed + 1))
    log_info "teardown complete (${removed} target group(s)). The kit is phase-neutral."
    exit "$incomplete"
}

main "$@"
