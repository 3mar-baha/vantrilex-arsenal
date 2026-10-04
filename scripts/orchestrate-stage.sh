#!/usr/bin/env bash
#
# orchestrate-stage.sh — phase-scoped kit injection and pruning.
#
# Given a lifecycle phase, it purges every previously injected component and
# injects exactly the ones this phase needs, so context spend tracks the work
# instead of keeping the whole kit hot in every session. Components live only
# in the phases their catalog record names.
#
# Inputs
# ------
# kit/kit.lock        JSON, the pinned kit. Two shapes are accepted:
#                       { "components": [ { "id": "...", "kind": "...",
#                                           "version": "..." }, ... ] }
#                       [ { "id": "...", "kind": "..." }, ... ]
#                     A bare string entry is read as an id with no kind. When a
#                     pin carries no kind, the id is matched against every kind;
#                     ids are unique within a kind, not across kinds.
#
# registry/catalog.json
#                     The generated machine mirror. Supplies each component's
#                     `phase` and `kind`. The phase vocabulary is the enum in
#                     registry/schema/catalog-v2.schema.json:
#                     scout | docs | plan | build | review | operate | on-demand
#                     `on-demand` is a catalog value but not an orchestrated
#                     phase: such a component loads when it is asked for, so
#                     pinning it to a phase would load it eagerly, which is the
#                     context cost this script exists to avoid.
#
# Injected layout
# ---------------
# Records land under .opencode/kit/<kind-dir>/<id>.md, mirroring the registry's
# own kind-to-directory mapping. That subtree is the injection root precisely
# because nothing tracked lives there: the shipped plugin, commands, and skills
# occupy .opencode/plugin/, .opencode/command/, and .opencode/skills/, and a
# purge step that could delete those would destroy the kit it is meant to serve.
#
# Severity
# --------
# A missing component record is a warning, not a fatal error: the registry is
# still being filled in, and a partially injected phase is still useful. A
# missing kit directory, a missing lock file, an unreadable catalog, or a phase
# that injects nothing at all is fatal. The script never edits project code,
# registry data, or documentation.
#
# Usage:
#   ./scripts/orchestrate-stage.sh <PHASE> [-h | --help]
#
# Exit status:
#   0 — phase orchestrated (individual missing records are warnings)
#   1 — refused on purpose, or a hard failure left nothing injected

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

KIT_DIR="${REPO_ROOT}/kit"
KIT_LOCK="${KIT_DIR}/kit.lock"
CATALOG="${REPO_ROOT}/registry/catalog.json"
KIT_ROOT="${REPO_ROOT}/.opencode/kit"

VALID_PHASES="scout docs plan build review operate"

INJECTED=0
WARNED=0
FAILED=0

log_info() { printf '[orchestrate] %s\n' "$*"; }
log_warn() { printf '[orchestrate] WARN: %s\n' "$*" >&2; }
log_error() { printf '[orchestrate] ERROR: %s\n' "$*" >&2; }

usage() {
    cat <<EOF
orchestrate-stage.sh — purge injected components, then inject exactly the
components one lifecycle phase needs.

Usage:
  ./scripts/orchestrate-stage.sh <PHASE>

Phases:
  ${VALID_PHASES// /, }

Inputs:
  kit/kit.lock          pinned kit (required; absence is fatal)
  registry/catalog.json phase and kind per component (required)

Exit status:
  0    Phase orchestrated; individual missing records reported as warnings.
  1    Invalid phase, missing kit lock or catalog, or nothing was injected.
EOF
}

is_valid_phase() {
    local candidate="$1" phase
    for phase in $VALID_PHASES; do
        [ "$candidate" = "$phase" ] && return 0
    done
    return 1
}

# select_components <phase>
# Prints one line per outcome on stdout, so a single stream carries both the
# selection and its diagnostics:
#   !id <TAB> reason                        the lock pins it, the catalog does not
#   id <TAB> kind <TAB> dir <TAB> record <TAB> ver
# where <dir> is the registry's directory name for that kind, so the injected
# tree mirrors the registry layout exactly. Records whose phase is null span
# phases and are therefore never injected; records belonging to another phase
# are pruned by design.
select_components() {
    node --input-type=module -e "$SELECTOR" "$KIT_LOCK" "$CATALOG" "$1"
}

SELECTOR=$(cat <<'NODE'
import { readFileSync } from "node:fs";
import { join } from "node:path";

// With `node -e` there is no script path, so argv[0] is the binary and the
// caller's arguments start at index 1.
const [lockPath, catalogPath, phase] = process.argv.slice(1);

const KIND_DIRS = {
  skill: "skills",
  mcp: "mcp",
  plugin: "plugins",
  hook: "hooks",
  agent: "agents",
  formatting: "formatting",
};

const bail = (message) => {
  process.stderr.write(`${message}\n`);
  process.exit(2);
};

const readJson = (path, label) => {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch (error) {
    bail(`${label} could not be read at ${path}: ${error.message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    bail(`${label} is not valid JSON at ${path}: ${error.message}`);
  }
};

const lock = readJson(lockPath, "kit lock");
const catalog = readJson(catalogPath, "catalog");

const pins = Array.isArray(lock) ? lock : Array.isArray(lock?.components) ? lock.components : null;
if (pins === null) {
  bail("kit lock must be a JSON array of components, or an object with a components array");
}
if (!Array.isArray(catalog?.components)) {
  bail(`catalog has no components array at ${catalogPath}`);
}

const byKindAndId = new Map();
const byId = new Map();
// NUL-separated keys so no kind/id pair can alias another by concatenation.
const KEY = (kind, id) => `${kind}\u0000${id}`;
for (const record of catalog.components) {
  if (!record || typeof record.id !== "string") continue;
  byKindAndId.set(KEY(record.kind, record.id), record);
  if (!byId.has(record.id)) byId.set(record.id, record);
}

const rows = [];
const warned = new Set();

for (const entry of pins) {
  const pin = typeof entry === "string" ? { id: entry } : entry;
  if (!pin || typeof pin.id !== "string" || pin.id.length === 0) {
    bail(`kit lock contains an entry without an id: ${JSON.stringify(entry)}`);
  }

  const record =
    typeof pin.kind === "string" ? byKindAndId.get(KEY(pin.kind, pin.id)) : byId.get(pin.id);

  if (!record) {
    if (!warned.has(pin.id)) {
      warned.add(pin.id);
      const reason = typeof pin.kind === "string" ? `no catalog record of kind ${pin.kind}` : "no catalog record";
      rows.push(`!${pin.id}\t${reason}`);
    }
    continue;
  }

  const dir = KIND_DIRS[record.kind];
  if (!dir) {
    bail(`catalog record ${record.id} has unknown kind ${record.kind}`);
  }
  if (record.phase === null || record.phase === undefined) continue;
  if (record.phase !== phase) continue;

  rows.push([
    record.id,
    record.kind,
    dir,
    join("registry", dir, `${record.id}.md`),
    typeof record.version_pin === "string" ? record.version_pin : "",
  ].join("\t"));
}

process.stdout.write(`${rows.join("\n")}\n`);
NODE
)

# purge_injected_kit
# Components live only in their own phase, so the previous phase's set is
# removed wholesale rather than diffed.
purge_injected_kit() {
    rm -rf "$KIT_ROOT"
    mkdir -p "$KIT_ROOT"
    log_info "purged ${KIT_ROOT#"$REPO_ROOT"/}"
}

inject_component() {
    # inject_component <id> <kind> <kind-dir> <relative-record-path> <version>
    local id="$1"
    local kind="$2"
    local dir="$3"
    local relative="$4"
    local version="$5"
    local source="${REPO_ROOT}/${relative}"
    local dest_dir="${KIT_ROOT}/${dir}"

    if [ ! -f "$source" ]; then
        log_warn "missing registry record, skipped: ${relative}"
        WARNED=$((WARNED + 1))
        return 0
    fi

    mkdir -p "$dest_dir"
    if ! cp "$source" "${dest_dir}/${id}.md"; then
        log_error "copy failed: ${relative} -> ${dest_dir#"$REPO_ROOT"/}/${id}.md"
        FAILED=$((FAILED + 1))
        return 1
    fi

    INJECTED=$((INJECTED + 1))
    if [ -n "$version" ]; then
        printf '[orchestrate] + %-11s %s@%s\n' "$kind" "$id" "$version"
    else
        printf '[orchestrate] + %-11s %s\n' "$kind" "$id"
    fi
}

print_inventory() {
    local dir count
    for dir in "$KIT_ROOT"/*; do
        [ -d "$dir" ] || continue
        count="$(find "$dir" -mindepth 1 -maxdepth 1 -type f | wc -l | tr -d ' ')"
        printf '[orchestrate] inventory .opencode/kit/%-11s %s component(s)\n' \
            "$(basename "$dir")/" "$count"
    done
}

main() {
    local phase="${1:-}"
    local selection status id kind dir relative version warn_id warn_reason

    if [ "${2:-}" = "-h" ] || [ "${2:-}" = "--help" ] || [ "$phase" = "-h" ] || [ "$phase" = "--help" ]; then
        usage
        exit 0
    fi

    if ! command -v node > /dev/null 2>&1; then
        log_error 'node is not on PATH; kit injection reads JSON and has no other reader.'
        exit 1
    fi

    if ! is_valid_phase "$phase"; then
        log_error "PHASE must be one of: ${VALID_PHASES// /, } (got: '${phase:-empty}')."
        usage >&2
        exit 1
    fi

    if [ ! -d "$KIT_DIR" ]; then
        log_error "kit directory not found: ${KIT_DIR#"$REPO_ROOT"/}"
        log_error 'the pinned kit manifest is the input to injection; there is nothing to inject from.'
        exit 1
    fi
    if [ ! -f "$KIT_LOCK" ]; then
        log_error "kit lock not found: ${KIT_LOCK#"$REPO_ROOT"/}"
        exit 1
    fi
    if [ ! -f "$CATALOG" ]; then
        log_error "catalog not found: ${CATALOG#"$REPO_ROOT"/}"
        log_error 'regenerate it with: node scripts/generate-catalog-json.mjs'
        exit 1
    fi

    log_info "orchestrating phase $phase against $REPO_ROOT"

    selection="$(select_components "$phase")"
    status=$?
    if [ "$status" -ne 0 ]; then
        log_error "could not resolve the pinned kit for phase $phase."
        exit 1
    fi

    purge_injected_kit

    # Field splitting on TAB is intended; ids, kinds, and paths carry none.
    while IFS=$'\t' read -r id kind dir relative version; do
        [ -n "$id" ] || continue
        case "$id" in
            '!'*)
                warn_id="${id#!}"
                warn_reason="${kind:-no reason given}"
                log_warn "pinned component has ${warn_reason}, skipped: ${warn_id}"
                WARNED=$((WARNED + 1))
                ;;
            *)
                inject_component "$id" "$kind" "$dir" "$relative" "$version"
                ;;
        esac
    done <<< "$selection"

    print_inventory

    if [ "$FAILED" -gt 0 ]; then
        log_error "$FAILED injection(s) failed; see the errors above."
        exit 1
    fi
    if [ "$INJECTED" -eq 0 ]; then
        log_error "no component in ${KIT_LOCK#"$REPO_ROOT"/} is pinned to phase $phase."
        log_error "either the lock needs a component for this phase, or the phase is wrong."
        exit 1
    fi

    log_info "phase $phase ready: ${INJECTED} injected, ${WARNED} skipped."
    exit 0
}

main "$@"
