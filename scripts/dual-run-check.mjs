#!/usr/bin/env node
/**
 * Vantrilex dual-run harness — the S1 gate, retired to a single runner by S3.
 *
 * Runs the verifiers on the same tree and then proves that the catalog-only
 * phase sets reproduce the selection record that the lock used to drive:
 *
 *   scripts/verify-kit.mjs       the lock's proofs — RETIRED in S3 (optional)
 *   scripts/verify-catalog.mjs   the catalog-only replacement proofs (P1–P8)
 *
 * With the lock deleted the kit runner is absent, so the harness prints the
 * retirement line, runs the catalog verifier alone, and keeps the parity check
 * that the switch depended on:
 *
 * The parity ledger compares .opencode/equip.manifest.json (measured from
 * kit/kit.lock as the pre-abolition baseline) against catalogPhaseSets(), which
 * places every selected component by its catalog phase and tier. An empty
 * ledger is the claim S2 depends on: switching injection to the catalog and the
 * record changes the selection by nothing. Any row in the ledger is drift and
 * fails this gate.
 *
 * This harness reads the lock only through verify-kit and the manifest; it
 * never derives a phase set from the lock itself. A missing kit runner is the
 * expected post-S3 state, not a skipped pass: the catalog runner and the parity
 * ledger still decide the verdict.
 *
 * Runtime: Node 25, ESM, zero dependencies.
 * Exit 0 when every present runner exits 0 and the ledger is empty, 1 otherwise.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { catalogPhaseSets } from "./verify-catalog.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = path.join(ROOT, ".opencode", "equip.manifest.json");
const PHASES = ["scout", "docs", "plan", "build", "review", "operate"];

const RUNNERS = [
  { label: "verify-kit", file: path.join("scripts", "verify-kit.mjs"), optional: true },
  { label: "verify-catalog", file: path.join("scripts", "verify-catalog.mjs") }
];

const failures = [];

const run = (runner) => {
  const absolute = path.join(ROOT, runner.file);
  console.log("[dual-run] $ node " + runner.file.split(path.sep).join("/"));
  const result = spawnSync(process.execPath, [absolute], { cwd: ROOT, encoding: "utf8" });
  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  if (stdout !== "") process.stdout.write(stdout.endsWith("\n") ? stdout : stdout + "\n");
  if (stderr !== "") process.stderr.write(stderr.endsWith("\n") ? stderr : stderr + "\n");
  const status = result.status === null ? "no exit status (" + String(result.error) + ")" : "exit " + result.status;
  console.log("[dual-run] " + runner.label + ": " + status);
  console.log("");
  if (result.status !== 0) failures.push(runner.label + " exited " + (result.status === null ? "without a status" : String(result.status)));
};

let recorded = null;
try {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  if (manifest === null || typeof manifest !== "object" || manifest.phases === null || typeof manifest.phases !== "object") {
    failures.push(".opencode/equip.manifest.json carries no phases object");
  } else {
    recorded = manifest.phases;
  }
} catch (error) {
  failures.push("cannot read .opencode/equip.manifest.json: " + String(error.message));
}

let ran = 0;
for (const runner of RUNNERS) {
  if (runner.optional === true && fs.existsSync(path.join(ROOT, runner.file)) === false) {
    console.log("[dual-run] " + runner.label + ": RETIRED (S3) — catalog-only run");
    console.log("");
    continue;
  }
  run(runner);
  ran += 1;
}

if (recorded !== null) {
  const derived = catalogPhaseSets();
  const ledger = [];
  const keys = [...new Set([...PHASES, ...Object.keys(recorded)])].sort();
  console.log("[dual-run] parity ledger (selection record vs catalogPhaseSets()):");
  for (const phase of keys) {
    const was = new Set(Array.isArray(recorded[phase]) ? recorded[phase] : []);
    const now = new Set(derived[phase] ?? []);
    const missing = [...was].filter((token) => now.has(token) === false).sort();
    const extra = [...now].filter((token) => was.has(token) === false).sort();
    const line =
      "  " +
      phase.padEnd(8) +
      " record " +
      String(was.size).padStart(3) +
      "  catalog " +
      String(now.size).padStart(3) +
      (missing.length === 0 && extra.length === 0 ? "  equal" : "  DRIFT");
    console.log("[dual-run]" + line);
    if (missing.length !== 0 || extra.length !== 0) {
      ledger.push({ phase, missing, extra });
    }
  }
  if (ledger.length === 0) {
    console.log("[dual-run] ledger: empty");
  } else {
    for (const row of ledger) {
      if (row.missing.length !== 0) {
        console.log("[dual-run]   " + row.phase + " recorded-only: " + row.missing.join(", "));
      }
      if (row.extra.length !== 0) {
        console.log("[dual-run]   " + row.phase + " catalog-only: " + row.extra.join(", "));
      }
    }
    failures.push("parity ledger is not empty (" + ledger.map((row) => row.phase).join(", ") + ")");
  }
}

console.log("");
if (failures.length === 0) {
  const scope = ran === RUNNERS.length ? "dual run" : "catalog-only run";
  console.log("[dual-run] VERDICT: PASS - " + scope + " green (" + ran + "/" + ran + " runners exit 0), parity ledger empty.");
} else {
  console.log("[dual-run] VERDICT: FAIL - " + failures.join("; ") + ".");
}
process.exitCode = failures.length === 0 ? 0 : 1;
