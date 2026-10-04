#!/usr/bin/env bash
#
# setup-git-hooks.sh — activate this repository's git hooks.
#
# One line of work (git config core.hooksPath .githooks) plus a sanity check,
# so a clone enforces secret scanning and zero AI attribution from the first
# commit. Idempotent.
#
# Usage:
#   ./scripts/setup-git-hooks.sh [-h | --help]
#
# Exit status:
#   0 — .githooks is the active hooks path
#   1 — refused: git missing, not a repository, or the path did not stick

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

usage() {
    cat <<'EOF'
setup-git-hooks.sh — point git at .githooks and confirm it took effect.

Usage:
  ./scripts/setup-git-hooks.sh

Exit status:
  0    core.hooksPath is .githooks.
  1    Refused; see the error above.
EOF
}

main() {
    if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
        usage
        exit 0
    fi

    if ! command -v git > /dev/null 2>&1; then
        printf 'ERROR: git is required but was not found on PATH.\n' >&2
        exit 1
    fi
    if [ ! -e "${REPO_ROOT}/.git" ]; then
        printf 'ERROR: %s is not a git repository.\n' "$REPO_ROOT" >&2
        exit 1
    fi

    git -C "$REPO_ROOT" config core.hooksPath .githooks
    printf '[git-hooks] hooksPath set to .githooks\n'

    if git -C "$REPO_ROOT" config core.hooksPath | grep -qx '.githooks'; then
        printf '[git-hooks] active: pre-commit (secrets and AI attribution), commit-msg (attribution).\n'
        exit 0
    fi
    printf 'ERROR: failed to activate .githooks.\n' >&2
    exit 1
}

main "$@"
