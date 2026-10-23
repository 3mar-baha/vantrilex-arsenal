---
name: vs-smithery
description: Use when a Smithery MCP or skill candidate needs searching, vetting, and single-item admission without bulk installs.
---

# Vs-Smithery

## Purpose

Teach the Smithery search-vet-add loop for one candidate at a time, with vetting before any add and with single-item proposals only. This skill proposes; it never admits in bulk, never writes the lock or the registry, and never executes installs on its own authority. All command facts below are grounded in the R2 bundle smithery section read live via `git show wt/vta-factory-08:VTA-FACTORY-08-R2-method.md` section 4, read-only. Anything beyond that bundle is marked `unverified` and never invented.

## When to Use

- When a Smithery MCP candidate needs searching by keyword before any vetting starts.
- When a Smithery skill candidate needs searching by task phrase before any vetting starts.
- When a found candidate needs a SCAN-FIRST vet verdict plus a provenance check before any proposal.
- When a vetted candidate needs a single-item lock-record proposal with no bulk step.
- When an operator asks how the Smithery CLI loop works and needs the verified command shapes only.

## Do NOT use

- To admit two or more candidates at once. Bulk admission is refused; one candidate yields at most one proposal.
- To invent an install command. A command is either quoted from the R2 bundle section 4.1 or marked `unverified` with a null install and a stated reason.
- To use the `npx @smithery/cli` spelling. The R2 bundle section 4.2 reports it as `unverified` against the registry-verified package name; never treat it as verified.
- To write `registry/data/*.jsonl`, `registry/catalog.json`, `.opencode/equip.manifest.json`, or any generated catalog Markdown. Those surfaces belong to their single writers.
- To skip SCAN-FIRST vetting. Search results never advance to a proposal without a recorded vet verdict for the same candidate identifier.
- To execute installs from the teaching seat. Teaching and logging only; the downstream single writer owns the write.

## Inputs

- One candidate identifier at a time, either an MCP search term or a skill search term.
- The target client name for an MCP add, or the target agent name for a skill add, stated before the add step is drafted.
- The R2 bundle smithery section, read-only, as the sole command ground truth: package `smithery` version `1.2.0` verified via `https://registry.npmjs.org/smithery/latest`, install `npm install -g smithery@latest` requiring Node.js 20 plus, docs page `https://smithery.ai/docs/concepts/cli`, homepage `https://smithery.ai/`, source repository `https://github.com/smithery-ai/cli`.
- The SCAN-FIRST procedure at `P2-SCAN-FIRST.md`, read live before any vet verdict is recorded.
- The proposal reference files `P3-MCP-A.json` and `P3-MCP-B.json`, used by reference only when a starter example is needed.
- The auth state for the seat: whether `smithery auth login` has completed and what `smithery auth whoami` reports.

## Procedure

Run search, then vet, then add, in that fixed order. Never reorder and never skip vet.

### Search with the verified CLI shapes

1. Confirm the CLI surface from the R2 bundle only. Endorsed install form is `npm install -g smithery@latest` with Node.js 20 plus, and the endorsed invocation shape is `npx smithery` as observed on `https://smithery.ai/`. Every other install spelling is out of scope.
2. Authenticate only through the documented gate: `smithery auth login` followed by `smithery auth whoami`. The bundle Important Notes state authentication is required for some operations.
3. Search MCP candidates with `smithery mcp search "github"` as the shape, replacing the quoted term with the single candidate term. Search skill candidates with `smithery skill search "code review"` as the shape, replacing the quoted phrase with the single task phrase.
4. Scripting note on machine-readable output. The `--json` flag is `unverified` in the R2 bundle: section 4.1 lists no `--json` flag on any command. Prefer machine-readable output only after the live `smithery --help` text on the seat proves the flag exists; until then record the flag as `unverified`, keep human-readable output as the evidence, and never invent flag behavior.
5. Record one search-evidence row per candidate: the exact command run, the seat output quoted, and the registry reference the output names. A candidate with no quoted search evidence does not advance.

### Vet with SCAN-FIRST plus provenance

1. Run SCAN-FIRST first for the same candidate identifier, following `P2-SCAN-FIRST.md` gate order: examine, then scan with the verdict recorded, then classify and route only when clean. A scan hit routes to quarantine; clean items from a hit batch wait held-pending and never advance on momentum.
2. Check provenance second: resolve the registry record at `https://registry.npmjs.org/smithery/latest` for the CLI itself, the docs page `https://smithery.ai/docs/concepts/cli` for the command shape, and the source repository `https://github.com/smithery-ai/cli` for ownership. For the candidate, record the observed count behavior as observed-fluctuate and never exact-today, matching the `P3-MCP-A.json` and `P3-MCP-B.json` observation discipline.
3. Inspect the candidate surface with the vetted read shapes only: `smithery tool list`, `smithery tool find`, and `smithery tool get <connection> <tool>`. Quote the exact output used for the verdict. Shapes beyond these three are `unverified` until the docs page proves them.
4. Record one vet verdict per candidate: `CLEAN` with quoted evidence, or `HIT` with the quarantine reference, or `HOLD` with the reason stated. A proposal needs a recorded `CLEAN` vet verdict; `HIT` and `HOLD` never advance.

### Add as a single-item proposal only

1. Draft at most one lock-record proposal per vetted candidate. The proposal carries tier `conditional`, evaluator `auto-evaluator`, install null with `verification: unverified` unless the install string was verified against a real registry from the seat, and the vet verdict reference.
2. Use the documented add shapes only: `smithery mcp add <url> --client <name>` for MCP candidates and `smithery skill add <skill> --agent <name>` for skill candidates. The bundle Important Notes state the client must restart after adding or removing servers; record the restart as pending until the owner confirms it.
3. Count bulk admissions on every run and keep the count at zero. One run proposes one item; a second candidate starts a new search-vet-add pass with its own evidence. If a bulk step is requested, refuse it, quote the request, and escalate.
4. Leave the write to the downstream single writer. This skill creates the proposal text; it never edits the lock, the registry sidecars, the generated mirror, or any installed tree, and it executes no install.

## Outputs

- One search-evidence row per candidate with the exact command and the quoted output reference.
- One vet verdict per candidate with `CLEAN`, `HIT`, or `HOLD` stated and the SCAN-FIRST plus provenance evidence quoted.
- At most one single-item lock-record proposal per `CLEAN` candidate, carrying `conditional` tier, `auto-evaluator` evaluator, null install with `verification: unverified` unless verified, and the vet reference.
- A bulk count of zero quoted on every run, with the per-item admit-or-hold decision stated per candidate.

## Failure Modes

- **Platform refusal.** Stop and report the exact platform error verbatim with the closest equivalent flagged. Never invent a workaround and never treat the refusal as a pass.
- **Scan hit before classify.** Route to quarantine per `P2-SCAN-FIRST.md`, hold clean companions pending, stage nothing from the hit batch, and escalate with the batch identifier and the finding quoted.
- **Unverified command requested.** Refuse the `npx @smithery/cli` spelling and any shape beyond section 4.1, record the spelling as `unverified`, and propose only through the verified shapes.
- **Bulk admission requested.** Refuse the bulk step, quote the request, keep the bulk count at zero, and continue one candidate at a time or stop for owner direction.
- **Auth gate closed.** Record that `smithery auth login` is pending, run only the operations the bundle marks as unauthenticated, and never record a vet verdict that needed an authenticated read.
- **Restart pending.** Record the required client restart as pending after any add-shape proposal and keep the candidate at proposal state until the owner confirms the reload.
- **Evidence missing.** A search without quoted output, a vet without a recorded verdict, or a proposal without its vet reference is discarded and rerun in gate order.
