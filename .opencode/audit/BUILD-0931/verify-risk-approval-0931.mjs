// verify-risk-approval-0931.mjs — LD-31 reserve honesty gate.
// ESM, zero dependencies (node builtins only). No installs.
// PASS: prints PROCEED digest=<sha256-of-spec> and exits 0.
// FAIL: prints HOLD <reasons> and exits 1.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const specPath = join(here, "risk-approval-0931.md");

let text = null;
try {
  text = readFileSync(specPath, "utf8");
} catch {
  console.log("HOLD missing-spec");
  process.exit(1);
}

const fails = [];
const need = (pattern, id) => {
  if (!pattern.test(text)) {
    fails.push(id);
  }
};

need(/0\.9\.31/, "no-advisory-number");
need(/advisory/i, "no-advisory-marker");
need(/design not started/i, "no-design-not-started");
need(/DEFERRED/, "no-deferred-tiers");
need(/clean record/i, "no-clean-record");
need(/guessing/, "no-guessing-marker");
need(/never-automate/, "no-never-automate");
need(/outside every tier/i, "no-outside-every-tier");
need(/policy-pack/, "no-policy-pack");
need(/kill-switch/, "no-kill-switch");
need(/low-tier-first/, "no-low-tier-first");
need(/weekly bundle/i, "no-weekly-bundle");
need(/stop-on-first-deviation/, "no-stop-on-first-deviation");
need(/exit criteria/i, "no-exit-criteria");
need(/open questions/i, "no-open-questions");
need(/tier-definitions: OPEN/, "no-tier-definitions-open");
need(/clean-weeks-count: OPEN/, "no-clean-weeks-count-open");
need(/low-tier-membership: OPEN/, "no-low-tier-membership-open");
need(
  /tiers formulated only after supervised clean record; standing list never automated/,
  "no-fbld31-verbatim",
);
need(/LD-31/, "no-ld31-id");
need(/FBLD-31/, "no-fbld31-id");

// The reserve forbids tier-definition tables: formulating tiers now would be
// guessing. Any markdown table row mentioning tiers fails the gate.
if (/^\s*\|.*tier.*$/im.test(text)) {
  fails.push("tier-table-present");
}
if (text.length === 0) {
  fails.push("empty-spec");
}

if (fails.length > 0) {
  console.log("HOLD " + fails.join(","));
  process.exit(1);
}

const digest = createHash("sha256").update(text, "utf8").digest("hex");
console.log("PROCEED digest=" + digest);
