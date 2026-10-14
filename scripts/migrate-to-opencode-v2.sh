#!/usr/bin/env bash
#
# migrate-to-opencode-v2.sh — move one project checkout toward the v2 layout.
#
# The run is plan-then-apply. A read-only planner detects every legacy path,
# key, and token. The backupper moves each original into a timestamped backup
# directory with a manifest. The applier writes the migrated form through
# individually idempotent actions. The reporter prints one line per action
# plus a final summary.
#
# Directory moves preserve content: command becomes commands, skill becomes
# skills, agent becomes agents, mode or modes becomes agents with a mode
# primary marker, and plugin becomes plugins by relocation alone. Plugin
# bodies are relocated only and never ported.
#
# Config renames touch project opencode.json and opencode.jsonc only. Anything
# uncertain is skipped with a warning and a guide entry. Nothing is guessed.
#
# Usage:
#   ./scripts/migrate-to-opencode-v2.sh [--dry-run] [-h | --help] [target-dir]
#
# Exit status:
#   0 — migrated, or already migrated (nothing to do)
#   1 — usage error, bad target, or backup failure
#   2 — migrated, but CLAUDE.md needs a human merge

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

DRY_RUN=0
TARGET=""
BACKUP_DIR=""
BACKUP_READY=0
MIGRATED=0
SKIPPED=0
WARNINGS=0
CONFLICT_HIT=0
MOVES=""
CONFIGS=""
FRONTS=""
CLAUDE_ACT="none"
GUIDE=""

log() { printf '[migrate] %s\n' "$*"; }
log_warn() { printf '[migrate] WARN: %s\n' "$*" >&2; }
log_skip() { printf '[migrate] SKIP: %s\n' "$*" >&2; }
log_conflict() { printf '[migrate] CONFLICT: %s\n' "$*" >&2; }
log_error() { printf '[migrate] ERROR: %s\n' "$*" >&2; }

usage() {
    cat <<EOF
migrate-to-opencode-v2.sh — move one project checkout toward the v2 layout.

Usage:
  ./scripts/migrate-to-opencode-v2.sh [--dry-run] [-h | --help] [target-dir]

Arguments:
  target-dir   Project directory to migrate (default: current directory).

Options:
  --dry-run    Plan only. Prints each action with a WOULD prefix and creates
               nothing, not even a backup directory.
  -h, --help   Print this help and exit.

Behaviour:
  Legacy directories under .opencode are moved with content preserved:
  command to commands, skill to skills, agent to agents, mode or modes to
  agents with a mode primary marker, plugin to plugins by relocation alone.
  Project opencode.json and opencode.jsonc keys are renamed. Markdown
  frontmatter tokens disable, permission and subtask are renamed. A missing
  CLAUDE.md becomes a symlink to AGENTS.md; a byte-identical one is replaced
  by that symlink; a distinct one is left for a human merge.

  Every touched original is moved into
  <target>/.opencode/.migrate-backup/<UTC timestamp>/ with a MANIFEST.txt of
  relative paths before anything is written. Uncertain conversions are
  skipped with a warning and a guide entry; nothing is guessed.

Exit status:
  0    Migrated, or already migrated (nothing to do).
  1    Usage error, bad target, or backup failure.
  2    Migrated, but CLAUDE.md needs a human merge.
EOF
}

# key_pairs prints one old=new pair per line for project config renames.
key_pairs() {
    cat <<EOF
permission=permissions
bash=shell
task=subagent
plugin=plugins
mcp=mcp.servers
enabled=disabled
prompt=system
disable=disabled
snapshot=snapshots
attachment=media
command=commands
subtask=subagent
reference=references
provider=providers
agent=agents
mode=agents
modes=agents
autoshare=share
preserve_recent_tokens=keep.tokens
reserved=buffer
EOF
}

# rename_config_keys reads JSON or JSONC on stdin and writes it with every
# legacy key renamed. Only quoted keys followed by a colon are matched, so
# values and already renamed keys pass through unchanged.
rename_config_keys() {
    sed \
        -e 's/"permission"\([[:space:]]*:\)/"permissions"\1/g' \
        -e 's/"bash"\([[:space:]]*:\)/"shell"\1/g' \
        -e 's/"task"\([[:space:]]*:\)/"subagent"\1/g' \
        -e 's/"plugin"\([[:space:]]*:\)/"plugins"\1/g' \
        -e 's/"mcp"\([[:space:]]*:\)/"mcp.servers"\1/g' \
        -e 's/"enabled"\([[:space:]]*:\)/"disabled"\1/g' \
        -e 's/"prompt"\([[:space:]]*:\)/"system"\1/g' \
        -e 's/"disable"\([[:space:]]*:\)/"disabled"\1/g' \
        -e 's/"snapshot"\([[:space:]]*:\)/"snapshots"\1/g' \
        -e 's/"attachment"\([[:space:]]*:\)/"media"\1/g' \
        -e 's/"command"\([[:space:]]*:\)/"commands"\1/g' \
        -e 's/"subtask"\([[:space:]]*:\)/"subagent"\1/g' \
        -e 's/"reference"\([[:space:]]*:\)/"references"\1/g' \
        -e 's/"provider"\([[:space:]]*:\)/"providers"\1/g' \
        -e 's/"agent"\([[:space:]]*:\)/"agents"\1/g' \
        -e 's/"modes"\([[:space:]]*:\)/"agents"\1/g' \
        -e 's/"mode"\([[:space:]]*:\)/"agents"\1/g' \
        -e 's/"autoshare"\([[:space:]]*:\)/"share"\1/g' \
        -e 's/"preserve_recent_tokens"\([[:space:]]*:\)/"keep.tokens"\1/g' \
        -e 's/"reserved"\([[:space:]]*:\)/"buffer"\1/g'
}

# uncertain records one human follow-up: a warning line, a skip line, and a
# guide entry. Nothing about the item is changed.
uncertain() {
    # uncertain <label> <guidance>
    log_warn "$1 needs a human ($2); left untouched."
    log_skip "$1 (see the guide section below)."
    SKIPPED=$((SKIPPED + 1))
    WARNINGS=$((WARNINGS + 1))
    GUIDE="${GUIDE}${1} :: $2
"
}

config_needs_rename() {
    # config_needs_rename <file>; true when any legacy key is present.
    local line old
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        old="${line%%=*}"
        if grep -q "\"${old}\"[[:space:]]*:" "$1"; then
            return 0
        fi
    done <<EOF
$(key_pairs)
EOF
    return 1
}

frontmatter_needs_rename() {
    # frontmatter_needs_rename <file>; prints yes when the leading fenced
    # block carries a legacy token.
    awk '
        BEGIN { found = 0; closed = 0 }
        NR == 1 { if ($0 != "---") exit; next }
        !closed && $0 == "---" { closed = 1; next }
        !closed && /^[[:space:]]*disable[[:space:]]*:/ { found = 1 }
        !closed && /^[[:space:]]*permission[[:space:]]*:/ { found = 1 }
        !closed && /^[[:space:]]*subtask[[:space:]]*:/ { found = 1 }
        END { if (closed && found) print "yes" }
    ' "$1"
}

frontmatter_missing_mode() {
    # frontmatter_missing_mode <file>; prints yes when the file opens with a
    # fenced block that carries no mode key.
    awk '
        BEGIN { seen = 0; closed = 0 }
        NR == 1 { if ($0 != "---") exit; next }
        !closed && $0 == "---" { closed = 1; next }
        !closed && /^[[:space:]]*mode[[:space:]]*:/ { seen = 1 }
        END { if (closed && !seen) print "yes" }
    ' "$1"
}

rewrite_frontmatter() {
    # rewrite_frontmatter reads markdown on stdin and renames legacy tokens
    # inside the leading fenced block only.
    awk '
        BEGIN { first = 0; closed = 0 }
        NR == 1 { first = ($0 == "---"); print; next }
        first && !closed && $0 == "---" { closed = 1; print; next }
        first && !closed {
            sub(/^[[:space:]]*disable([[:space:]]*:)/, "disabled:")
            sub(/^[[:space:]]*permission([[:space:]]*:)/, "permissions:")
            sub(/^[[:space:]]*subtask([[:space:]]*:)/, "subagent:")
            print; next
        }
        { print }
    ' "$1"
}

add_mode_marker() {
    # add_mode_marker <file>; inserts a mode primary marker after the opening
    # fence of a file that has none. The caller checks the precondition.
    local tmp
    tmp="$1.tmp"
    if awk 'NR == 1 { print; if ($0 == "---") print "mode: primary"; next } { print }' "$1" > "$tmp"; then
        mv "$tmp" "$1"
    else
        log_warn "could not mark mode origin in \"$1\"; left as relocated."
        WARNINGS=$((WARNINGS + 1))
    fi
}

plan_moves() {
    # plan_moves fills MOVES with kind|src|dst lines for legacy directories
    # that still exist under the target .opencode directory.
    local oc pair src dst
    oc="${TARGET}/.opencode"
    [ -d "$oc" ] || return 0
    for pair in "command|commands|dir" "skill|skills|dir" "agent|agents|dir" "mode|agents|mode" "modes|agents|mode" "plugin|plugins|dir"; do
        src="${pair%%|*}"
        dst="$(printf '%s' "$pair" | cut -d '|' -f 2)"
        if [ -d "${oc}/${src}" ] || [ -L "${oc}/${src}" ]; then
            MOVES="${MOVES}${pair##*|}|.opencode/${src}|.opencode/${dst}
"
        fi
    done
}

plan_configs() {
    # plan_configs fills CONFIGS and records uncertain config items.
    local rel file
    for rel in "opencode.json" "opencode.jsonc"; do
        file="${TARGET}/${rel}"
        [ -f "$file" ] || continue
        if config_needs_rename "$file"; then
            CONFIGS="${CONFIGS}${rel}
"
        fi
        if grep -q '"temperature"[[:space:]]*:' "$file"; then
            uncertain "\"temperature\" in \"${rel}\"" "temperature placement stays manual"
        fi
        if grep -q '"top_p"[[:space:]]*:' "$file"; then
            uncertain "\"top_p\" in \"${rel}\"" "sampling option placement stays manual"
        fi
        if grep -q '"maxSteps"[[:space:]]*:' "$file"; then
            uncertain "\"maxSteps\" in \"${rel}\"" "step limit rename needs a review of step semantics"
        fi
        if grep -q '"tui"[[:space:]]*:' "$file"; then
            uncertain "\"tui\" in \"${rel}\"" "interface section rename stays manual"
        fi
        if grep -q '"options"[[:space:]]*:' "$file"; then
            uncertain "\"options\" in \"${rel}\"" "option relocation stays manual"
        fi
        if grep -q '"timeout"[[:space:]]*:' "$file"; then
            uncertain "\"timeout\" in \"${rel}\"" "timeout shape split stays manual"
        fi
        if grep -q '"client_id"[[:space:]]*:' "$file" || grep -q '"client_secret"[[:space:]]*:' "$file"; then
            uncertain "OAuth keys in \"${rel}\"" "OAuth key shape stays manual"
        fi
        if grep -q '"paths"[[:space:]]*:' "$file" || grep -q '"urls"[[:space:]]*:' "$file"; then
            uncertain "skills path lists in \"${rel}\"" "path list conversion to array form stays manual"
        fi
    done
}

plan_frontmatter() {
    # plan_frontmatter fills FRONTS with markdown files whose leading fenced
    # block carries a legacy token. The backup tree is never scanned.
    local oc dir file found
    oc="${TARGET}/.opencode"
    [ -d "$oc" ] || return 0
    for dir in command commands skill skills agent agents mode modes plugin plugins; do
        [ -d "${oc}/${dir}" ] || continue
        found="$(find "${oc}/${dir}" -type f -name '*.md' -print)"
        [ -n "$found" ] || continue
        while IFS= read -r file; do
            [ -n "$file" ] || continue
            if [ "$(frontmatter_needs_rename "$file")" = "yes" ]; then
                FRONTS="${FRONTS}${file#"$TARGET"/}
"
            fi
        done <<EOF
$found
EOF
    done
}

plan_plugin_bodies() {
    # plan_plugin_bodies warns when plugin implementations exist: they are
    # relocated only and never ported.
    local oc dir found
    oc="${TARGET}/.opencode"
    for dir in plugin plugins; do
        [ -d "${oc}/${dir}" ] || continue
        found="$(find "${oc}/${dir}" -type f \( -name '*.mjs' -o -name '*.js' -o -name '*.ts' \) -print | head -n 1)"
        if [ -n "$found" ]; then
            uncertain "plugin implementations under \".opencode/${dir}\"" "bodies relocate only and are never ported"
            return 0
        fi
    done
}

claude_replaced_before() {
    # claude_replaced_before is true when a previous run already backed up
    # CLAUDE.md. The manifests are the run history: on platforms where the
    # link step lands as a copy, the identical file left behind must read as
    # already migrated, or every run would replace it again.
    local m
    for m in "${TARGET}/.opencode/.migrate-backup/"*/MANIFEST.txt; do
        [ -f "$m" ] || continue
        if grep -q '^CLAUDE.md$' "$m"; then
            return 0
        fi
    done
    return 1
}

plan_claude() {
    # plan_claude sets CLAUDE_ACT to one of: none, link, replace, conflict,
    # skip-no-agents, skip-foreign.
    local claude agents link_target
    claude="${TARGET}/CLAUDE.md"
    agents="${TARGET}/AGENTS.md"
    if [ -e "$claude" ] || [ -L "$claude" ]; then
        if [ -L "$claude" ]; then
            link_target="$(readlink "$claude")"
            if [ "$link_target" = "AGENTS.md" ] || [ "$link_target" = "$agents" ]; then
                CLAUDE_ACT="none"
            else
                CLAUDE_ACT="skip-foreign"
                uncertain "\"CLAUDE.md\" symlink to \"${link_target}\"" "foreign symlink target stays manual"
            fi
            return 0
        fi
        if [ ! -f "$agents" ]; then
            CLAUDE_ACT="skip-no-agents"
            uncertain "\"CLAUDE.md\" without \"AGENTS.md\"" "no counterpart to link against stays manual"
            return 0
        fi
        if cmp -s "$claude" "$agents"; then
            if claude_replaced_before; then
                CLAUDE_ACT="none"
            else
                CLAUDE_ACT="replace"
            fi
        else
            CLAUDE_ACT="conflict"
        fi
        return 0
    fi
    if [ -f "$agents" ]; then
        CLAUDE_ACT="link"
    else
        CLAUDE_ACT="none"
    fi
}

ensure_backup_dir() {
    # ensure_backup_dir creates the timestamped backup tree once per run.
    local stamp
    if [ "$BACKUP_READY" -eq 1 ]; then
        return 0
    fi
    stamp="$(date -u +%Y%m%dT%H%M%SZ)"
    BACKUP_DIR="${TARGET}/.opencode/.migrate-backup/${stamp}"
    if ! mkdir -p "$BACKUP_DIR"; then
        log_error "could not create backup directory \"${BACKUP_DIR}\"."
        return 1
    fi
    if ! : > "${BACKUP_DIR}/MANIFEST.txt"; then
        log_error "could not write manifest in \"${BACKUP_DIR}\"."
        return 1
    fi
    BACKUP_READY=1
    return 0
}

backup_original() {
    # backup_original <target-relative-path> moves the original into the
    # backup tree and records it in the manifest.
    local rel src dest
    rel="$1"
    src="${TARGET}/${rel}"
    if ! ensure_backup_dir; then
        return 1
    fi
    dest="${BACKUP_DIR}/${rel}"
    if ! mkdir -p "$(dirname "$dest")"; then
        log_error "could not stage backup for \"${rel}\"."
        return 1
    fi
    if ! mv "$src" "$dest"; then
        log_error "could not back up \"${rel}\"."
        return 1
    fi
    if ! printf '%s\n' "$rel" >> "${BACKUP_DIR}/MANIFEST.txt"; then
        log_error "could not record manifest for \"${rel}\"."
        return 1
    fi
    return 0
}

apply_one_move() {
    # apply_one_move <kind> <src-rel> <dst-rel>
    local kind src_rel dst_rel src dst bsrc entries entry base dfile rel mode_rels
    kind="$1"
    src_rel="$2"
    dst_rel="$3"
    src="${TARGET}/${src_rel}"
    dst="${TARGET}/${dst_rel}"
    if [ ! -e "$src" ] && [ ! -L "$src" ]; then
        return 0
    fi
    if ! backup_original "$src_rel"; then
        return 1
    fi
    bsrc="${BACKUP_DIR}/${src_rel}"
    # The merge branch below drains the backup source, so mode marker
    # candidates are captured before placement, not after.
    mode_rels=""
    if [ "$kind" = "mode" ]; then
        entries="$(find "$bsrc" -type f -name '*.md' -print)"
        while IFS= read -r entry; do
            [ -n "$entry" ] || continue
            mode_rels="${mode_rels}${entry#"$bsrc"/}
"
        done <<EOF
$entries
EOF
    fi
    if [ ! -e "$dst" ] && [ ! -L "$dst" ]; then
        if ! mkdir -p "$(dirname "$dst")"; then
            log_error "could not create parent for \"${dst_rel}\"."
            return 1
        fi
        if ! cp -a "$bsrc" "$dst"; then
            log_error "could not place \"${dst_rel}\"."
            return 1
        fi
    else
        if [ ! -d "$dst" ]; then
            log_error "cannot merge \"${src_rel}\" into non-directory \"${dst_rel}\"."
            return 1
        fi
        entries="$(find "$bsrc" -mindepth 1 -maxdepth 1 -print)"
        while IFS= read -r entry; do
            [ -n "$entry" ] || continue
            base="$(basename "$entry")"
            if [ ! -e "${dst}/${base}" ] && [ ! -L "${dst}/${base}" ]; then
                if ! mv "$entry" "${dst}/${base}"; then
                    log_error "could not merge \"${base}\" into \"${dst_rel}\"."
                    return 1
                fi
            else
                log_warn "collision for \"${base}\" in \"${dst_rel}\"; kept the existing file and left the original in the backup."
                WARNINGS=$((WARNINGS + 1))
                SKIPPED=$((SKIPPED + 1))
            fi
        done <<EOF
$entries
EOF
    fi
    if [ "$kind" = "mode" ]; then
        while IFS= read -r rel; do
            [ -n "$rel" ] || continue
            dfile="${dst}/${rel}"
            if [ -f "$dfile" ] && [ "$(frontmatter_missing_mode "$dfile")" = "yes" ]; then
                add_mode_marker "$dfile"
            fi
        done <<EOF
$mode_rels
EOF
    fi
    log "move: \"${src_rel}\" -> \"${dst_rel}\""
    MIGRATED=$((MIGRATED + 1))
    return 0
}

apply_one_config() {
    # apply_one_config <target-relative-path>
    local rel
    rel="$1"
    if ! config_needs_rename "${TARGET}/${rel}"; then
        return 0
    fi
    if ! backup_original "$rel"; then
        return 1
    fi
    if ! rename_config_keys < "${BACKUP_DIR}/${rel}" > "${TARGET}/${rel}"; then
        log_error "could not rewrite \"${rel}\"."
        return 1
    fi
    log "rename keys: \"${rel}\""
    MIGRATED=$((MIGRATED + 1))
    return 0
}

apply_one_frontmatter() {
    # apply_one_frontmatter <target-relative-path>
    local rel
    rel="$1"
    if [ "$(frontmatter_needs_rename "${TARGET}/${rel}")" != "yes" ]; then
        return 0
    fi
    if ! backup_original "$rel"; then
        return 1
    fi
    if ! rewrite_frontmatter "${BACKUP_DIR}/${rel}" > "${TARGET}/${rel}"; then
        log_error "could not rewrite \"${rel}\"."
        return 1
    fi
    log "rename frontmatter tokens: \"${rel}\""
    MIGRATED=$((MIGRATED + 1))
    return 0
}

link_claude_at() {
    # link_claude_at <link-path>; symlinks, falling back to a copy with an
    # explicit warning when the platform refuses symlinks. Some setups report
    # success while landing a copy, so the link itself is verified.
    if ln -s "AGENTS.md" "$1" 2> /dev/null && [ -L "$1" ]; then
        return 0
    fi
    if [ ! -e "$1" ] && [ ! -L "$1" ]; then
        if ! cp -a "${TARGET}/AGENTS.md" "$1"; then
            return 1
        fi
    fi
    log_warn "symlink refused for \"CLAUDE.md\"; left a copy of \"AGENTS.md\" instead, so the two files will not stay in sync."
    WARNINGS=$((WARNINGS + 1))
    return 0
}

apply_claude() {
    local claude agents
    claude="${TARGET}/CLAUDE.md"
    agents="${TARGET}/AGENTS.md"
    case "$CLAUDE_ACT" in
        link)
            if ! link_claude_at "$claude"; then
                log_error "could not create \"CLAUDE.md\"."
                return 1
            fi
            log "link: \"CLAUDE.md\" -> \"AGENTS.md\""
            MIGRATED=$((MIGRATED + 1))
            ;;
        replace)
            if ! backup_original "CLAUDE.md"; then
                return 1
            fi
            if ! link_claude_at "$claude"; then
                log_error "could not replace \"CLAUDE.md\" with a symlink."
                return 1
            fi
            log "replace byte-identical \"CLAUDE.md\" with a symlink to \"AGENTS.md\""
            MIGRATED=$((MIGRATED + 1))
            ;;
        conflict)
            CONFLICT_HIT=1
            log_conflict "\"CLAUDE.md\" differs from \"AGENTS.md\"; left untouched."
            log_conflict "merge \"CLAUDE.md\" into \"AGENTS.md\" by hand, then replace \"CLAUDE.md\" with a symlink to \"AGENTS.md\"."
            ;;
        none | skip-no-agents | skip-foreign)
            return 0
            ;;
    esac
    return 0
}

remap_rel() {
    # remap_rel <target-relative-path> prints the path after the planned
    # directory moves. The dry run shows post-move paths so its transcript
    # matches what the real run reports; the transform is display-only.
    local line msrc mdst
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        msrc="$(printf '%s' "$line" | cut -d '|' -f 2)"
        mdst="$(printf '%s' "$line" | cut -d '|' -f 3)"
        case "$1" in
            "${msrc}/"*)
                printf '%s' "${mdst}${1#"$msrc"}"
                return 0
                ;;
        esac
    done <<EOF
$MOVES
EOF
    printf '%s' "$1"
}

describe_plan() {
    # describe_plan prints one WOULD line per planned action for dry runs.
    local line kind src dst
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        kind="${line%%|*}"
        src="$(printf '%s' "$line" | cut -d '|' -f 2)"
        dst="$(printf '%s' "$line" | cut -d '|' -f 3)"
        log "WOULD: move \"${src}\" -> \"${dst}\""
        MIGRATED=$((MIGRATED + 1))
    done <<EOF
$MOVES
EOF
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        log "WOULD: rename keys in \"${line}\""
        MIGRATED=$((MIGRATED + 1))
    done <<EOF
$CONFIGS
EOF
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        log "WOULD: rename frontmatter tokens in \"$(remap_rel "$line")\""
        MIGRATED=$((MIGRATED + 1))
    done <<EOF
$FRONTS
EOF
    case "$CLAUDE_ACT" in
        link)
            log "WOULD: link \"CLAUDE.md\" -> \"AGENTS.md\""
            MIGRATED=$((MIGRATED + 1))
            ;;
        replace)
            log "WOULD: replace byte-identical \"CLAUDE.md\" with a symlink to \"AGENTS.md\""
            MIGRATED=$((MIGRATED + 1))
            ;;
        conflict)
            log_conflict "WOULD: skip distinct \"CLAUDE.md\" for a human merge."
            CONFLICT_HIT=1
            ;;
    esac
}

print_guide() {
    # print_guide lists every human follow-up plus the categories this
    # script never converts on its own.
    local line
    [ -n "$GUIDE" ] || return 0
    log "guide: the following were left for a human:"
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        log "guide: - ${line}"
    done <<EOF
$GUIDE
EOF
    log "guide: categories this script never converts on its own:"
    log "guide: - plugin bodies (relocated only, never ported)"
    log "guide: - server API entries"
    log "guide: - interface section renames"
    log "guide: - temperature, sampling option, and option moves"
    log "guide: - step limit renames"
    log "guide: - provider splits and provider identity canonicalization"
    log "guide: - model reshapes and policy normalization"
    log "guide: - any variant join that would need a model string"
}

print_summary() {
    local backup_label
    backup_label="none"
    if [ "$BACKUP_READY" -eq 1 ]; then
        backup_label="$BACKUP_DIR"
    fi
    log "summary: migrated=${MIGRATED} skipped=${SKIPPED} warnings=${WARNINGS} backup=\"${backup_label}\""
}

apply_plan() {
    # apply_plan runs the backupper and applier over the planned items.
    # Directory moves land first so each path is backed up exactly once: a
    # file backup followed by an ancestor directory backup would nest the
    # directory inside its own backup copy and shadow the rewritten files.
    # The frontmatter plan is then re-resolved at the post-move paths before
    # the rewrites run; config files sit outside moved trees and keep their
    # planned paths.
    local line kind src dst
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        kind="${line%%|*}"
        src="$(printf '%s' "$line" | cut -d '|' -f 2)"
        dst="$(printf '%s' "$line" | cut -d '|' -f 3)"
        if ! apply_one_move "$kind" "$src" "$dst"; then
            return 1
        fi
    done <<EOF
$MOVES
EOF
    FRONTS=""
    plan_frontmatter
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        if ! apply_one_config "$line"; then
            return 1
        fi
    done <<EOF
$CONFIGS
EOF
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        if ! apply_one_frontmatter "$line"; then
            return 1
        fi
    done <<EOF
$FRONTS
EOF
    if ! apply_claude; then
        return 1
    fi
    return 0
}

parse_args() {
    while [ $# -gt 0 ]; do
        case "$1" in
            --dry-run)
                DRY_RUN=1
                ;;
            -h | --help)
                usage
                exit 0
                ;;
            --)
                shift
                break
                ;;
            -*)
                usage >&2
                exit 1
                ;;
            *)
                if [ -n "$TARGET" ]; then
                    usage >&2
                    exit 1
                fi
                TARGET="$1"
                ;;
        esac
        shift
    done
    if [ $# -gt 0 ]; then
        if [ -n "$TARGET" ] || [ $# -gt 1 ]; then
            usage >&2
            exit 1
        fi
        TARGET="$1"
    fi
}

main() {
    parse_args "$@"

    if [ -z "$TARGET" ]; then
        TARGET="$(pwd)"
    fi
    if [ ! -d "$TARGET" ]; then
        log_error "target is not a directory: \"${TARGET}\"."
        usage >&2
        exit 1
    fi
    TARGET="$(cd "$TARGET" && pwd)"

    if [ "$TARGET" = "$REPO_ROOT" ]; then
        log "target is the repository checkout itself."
    fi
    log "planning migration in \"${TARGET}\"."

    plan_moves
    plan_configs
    plan_frontmatter
    plan_plugin_bodies
    plan_claude

    if [ "$DRY_RUN" -eq 1 ]; then
        describe_plan
        print_guide
        print_summary
        if [ "$CONFLICT_HIT" -eq 1 ]; then
            exit 2
        fi
        exit 0
    fi

    if [ -z "$MOVES" ] && [ -z "$CONFIGS" ] && [ -z "$FRONTS" ] && { [ "$CLAUDE_ACT" = "none" ] || [ "$CLAUDE_ACT" = "skip-no-agents" ] || [ "$CLAUDE_ACT" = "skip-foreign" ]; }; then
        if [ -z "$GUIDE" ]; then
            log "already migrated: nothing to do."
        else
            log "already migrated: nothing to do; human follow-ups remain below."
        fi
        print_guide
        print_summary
        exit 0
    fi

    if ! apply_plan; then
        print_summary
        exit 1
    fi
    print_guide
    print_summary
    if [ "$CONFLICT_HIT" -eq 1 ]; then
        exit 2
    fi
    exit 0
}

main "$@"
