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
# .opencode/equip.manifest.json
#                     JSON, the phase selection record (Q-25). Shape:
#                       { "phases": { "<phase>": [ "<kind>/<id>", ... ] } }
#                     The record says which components a phase selects. Every
#                     token is `kind/id` because ids are unique within a kind,
#                     not across kinds (`supabase` and `vercel` are each both an
#                     mcp and a cli).
#
# registry/catalog.json
#                     The generated machine mirror. Resolves every token to a
#                     real row, which supplies the kind directory and the
#                     version pin. The phase vocabulary is the enum in
#                     registry/schema/catalog-v2.schema.json:
#                     scout | docs | plan | build | review | operate | on-demand
#                     `on-demand` is a catalog value but not an orchestrated
#                     phase: such a component loads when it is asked for, so
#                     pinning it to a phase would load it eagerly, which is the
#                     context cost this script exists to avoid.
#                     The catalog's `phase` for a token must agree with the
#                     phase that selects it, so the record cannot place a
#                     component where the catalog does not. That agreement is
#                     what scripts/dual-run-check.mjs measures as parity.
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
# missing selection record, an unreadable catalog, a token that does not
# resolve, a token the catalog places in another phase, or a phase that injects
# nothing at all is fatal. The script never edits project code, registry data,
# or documentation.
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

MANIFEST="${REPO_ROOT}/.opencode/equip.manifest.json"
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
  .opencode/equip.manifest.json phase selection record (required; absence is fatal)
  registry/catalog.json         kind, phase and version per component (required)

Exit status:
  0    Phase orchestrated; individual missing records reported as warnings.
  1    Invalid phase, missing selection record or catalog, an unresolved
       token, or nothing was injected.
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
# Prints one TAB-separated line per selected component on stdout:
#   id <TAB> kind <TAB> dir <TAB> record <TAB> ver
# where <dir> is the registry's directory name for that kind, so the injected
# tree mirrors the registry layout exactly. The phase set comes from
# .opencode/equip.manifest.json; every token in it must resolve against
# registry/catalog.json, and the catalog must place that token in the same
# phase. A token that does not resolve, or resolves elsewhere, is fatal: the
# extraction never shrinks itself into a smaller-but-green phase.
select_components() {
    node --input-type=module -e "$SELECTOR" "$MANIFEST" "$CATALOG" "$1"
}

SELECTOR=$(cat <<'NODE'
import { readFileSync } from "node:fs";
import { join } from "node:path";

// With `node -e` there is no script path, so argv[0] is the binary and the
// caller's arguments start at index 1.
const [manifestPath, catalogPath, phase] = process.argv.slice(1);

const KIND_DIRS = {
  agent: "agents",
  benchmark: "benchmarks",
  cli: "cli",
  dataset: "datasets",
  "design.md": "design",
  formatting: "formatting",
  hook: "hooks",
  lsp: "lsp",
  mcp: "mcp",
  plugin: "plugins",
  policy: "policies",
  prompt: "prompts",
  skill: "skills",
  template: "templates",
  theme: "themes",
  workflow: "workflows",
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

const manifest = readJson(manifestPath, "equip manifest");
const catalog = readJson(catalogPath, "catalog");

if (manifest === null || typeof manifest !== "object" || manifest.phases === null || typeof manifest.phases !== "object") {
  bail(`equip manifest carries no phases object at ${manifestPath}`);
}
if (!Array.isArray(catalog?.components)) {
  bail(`catalog has no components array at ${catalogPath}`);
}

const tokens = manifest.phases[phase];
if (!Array.isArray(tokens)) {
  bail(`equip manifest carries no array for phase ${phase} at ${manifestPath}`);
}

const byKindAndId = new Map();
// NUL-separated keys so no kind/id pair can alias another by concatenation.
const KEY = (kind, id) => `${kind}\u0000${id}`;
for (const record of catalog.components) {
  if (!record || typeof record.id !== "string" || typeof record.kind !== "string") continue;
  byKindAndId.set(KEY(record.kind, record.id), record);
}

const rows = [];
const seen = new Set();

for (const token of tokens) {
  if (typeof token !== "string") {
    bail(`equip manifest phase ${phase} carries a non-string entry: ${JSON.stringify(token)}`);
  }
  if (seen.has(token)) {
    bail(`equip manifest phase ${phase} carries ${token} more than once`);
  }
  seen.add(token);

  const boundary = token.indexOf("/");
  if (boundary <= 0 || boundary === token.length - 1) {
    bail(`equip manifest token is not <kind>/<id>: ${token}`);
  }
  const kind = token.slice(0, boundary);
  const id = token.slice(boundary + 1);

  const record = byKindAndId.get(KEY(kind, id));
  if (!record) {
    bail(`equip manifest token ${token} has no ${kind} row in the catalog (phase ${phase})`);
  }
  const dir = KIND_DIRS[record.kind];
  if (!dir) {
    bail(`catalog record ${token} has unknown kind ${record.kind}`);
  }
  if (record.phase !== phase) {
    bail(`equip manifest token ${token} is selected for phase ${phase}, but the catalog places it in ${JSON.stringify(record.phase)}`);
  }

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
    local selection status id kind dir relative version

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

    if [ ! -f "$MANIFEST" ]; then
        log_error "selection record not found: ${MANIFEST#"$REPO_ROOT"/}"
        log_error 'the selection record is the input to injection; there is nothing to inject from.'
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
        log_error "could not resolve the selected components for phase $phase."
        exit 1
    fi

    purge_injected_kit

    # Field splitting on TAB is intended; ids, kinds, and paths carry none.
    while IFS=$'\t' read -r id kind dir relative version; do
        [ -n "$id" ] || continue
        inject_component "$id" "$kind" "$dir" "$relative" "$version"
    done <<< "$selection"

    print_inventory

    if [ "$FAILED" -gt 0 ]; then
        log_error "$FAILED injection(s) failed; see the errors above."
        exit 1
    fi
    if [ "$INJECTED" -eq 0 ]; then
        log_error "no component in ${MANIFEST#"$REPO_ROOT"/} is selected for phase $phase."
        log_error "either the record needs a component for this phase, or the phase is wrong."
        exit 1
    fi

    log_info "phase $phase ready: ${INJECTED} injected, ${WARNED} skipped."
    exit 0
}

main "$@"
