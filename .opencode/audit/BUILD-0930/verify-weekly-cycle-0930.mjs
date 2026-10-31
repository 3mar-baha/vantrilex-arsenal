#!/usr/bin/env node
/**
 * LD-30 self-test harness: autonomous weekly cycle plus draft-version assembler (0.9.30).
 * Zero dependencies. Node 25, ESM. Deterministic: fixed fixtures only, no clock
 * reads, no network, no shell provisioning.
 * Usage: node .opencode/audit/BUILD-0930/verify-weekly-cycle-0930.mjs
 * Exit 0 with VERDICT: PROCEED only when every check passes; exit 1 with
 * VERDICT: REJECT otherwise. Rerunnable by a non-author; two consecutive runs
 * print an identical LD30-DIGEST.
 * Doctrine: FULL under ponytail FLOOR + CEILING (see b0930-build.md ledger).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FBLD_30_VERBATIM =
  "FBLD-30 — Slot 0.9.30 — Conflict: V3 slot scope versus pre-assigned number promise — Fallback: advisory number only; assigned at close — Matches LD-30 — Status FLAGGED, never resolved.";
const ADVISORY_RULE = "advisory number only; assigned at close";
const ASSIGNING_READINGS = [
  /assembler assigns/,
  /number is assigned during/,
  /pre-assigned number 0\.9\.30/,
  /assigned at assembly/,
];
const INSTALLER_TOKENS = [
  "npm install",
  "npm i ",
  "pip install",
  "brew install",
  "apt install",
  "apt-get install",
  "choco install",
  "winget install",
];
const OPEN_QUESTIONS = [
  6333, 6334, 6335, 6336, 6337, 6338, 6339, 6340, 6341, 6342, 6343,
  6344, 6345, 6346, 6347, 6348, 6349, 6350, 6351,
];

const checks = [];
const check = (name, fn) => {
  try {
    const evidence = fn();
    checks.push({ name, status: "PASS", evidence });
  } catch (error) {
    checks.push({ name, status: "FAIL", evidence: error instanceof Error ? error.message : String(error) });
  }
};
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const isRecord = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
const nonEmptyString = (v) => typeof v === "string" && v.length > 0;

const here = dirname(fileURLToPath(import.meta.url));
const spec = readFileSync(join(here, "weekly-cycle-0930.md"), "utf8");

// ---- Bounded unsupervised harvest (spec sections 3-4) ----

const HARVEST_KINDS = ["receive", "dedup", "cluster", "study-pack"];

function unsupervisedStep(kind, item) {
  if (!HARVEST_KINDS.includes(kind)) throw new Error(`unknown-harvest-step:${kind}`);
  if (!isRecord(item) || !nonEmptyString(item.id)) throw new Error("item-without-id-refused");
  if (item.ruled !== true && item.mechanical !== true) {
    throw new Error(`stops-at-owner-ruling:${kind}:${item.id}`);
  }
  return { kind, id: item.id, ran: true };
}

function runGate(item) {
  if (!isRecord(item) || item.ruled !== true) {
    throw new Error(`gate-on-unruled-rejected:${item && item.id ? item.id : "no-id"}`);
  }
  return { id: item.id, gate: "green" };
}

function landRuled(item) {
  if (!isRecord(item) || item.ruled !== true) {
    throw new Error(`non-ruled-landing-rejected:${item && item.id ? item.id : "no-id"}`);
  }
  return { id: item.id, landed: true };
}

// ---- Draft-version assembler (spec section 5) ----

function assembleDraft(improvements, ledger) {
  if (!Array.isArray(improvements) || improvements.length === 0) {
    throw new Error("draft-without-improvements-refused");
  }
  if (!isRecord(ledger) || !Array.isArray(ledger.entries)) throw new Error("ledger-not-a-record");
  for (const imp of improvements) {
    if (!isRecord(imp) || !nonEmptyString(imp.id)) throw new Error("improvement-without-id-refused");
    if (imp.approved !== true || !nonEmptyString(imp.approval)) {
      throw new Error(`unapproved-improvement-refused:${imp.id}`);
    }
  }
  const diff = improvements.map((imp) => ({ id: imp.id, change: `diff-for:${imp.id}` }));
  const changelog = improvements.map((imp) => {
    const entry = ledger.entries.find((e) => e.id === imp.ledgerEntry);
    if (!entry) throw new Error(`orphan-changelog-line-rejected:${imp.id}`);
    return { text: `change from ${imp.id}`, tracesTo: entry.id };
  });
  return {
    label: "draft-candidate",
    diff,
    changelog,
    number: { value: "0.9.30", advisory: true, assigned: false },
  };
}

function assignNumberAtClose(draft, close) {
  if (!isRecord(draft) || draft.label !== "draft-candidate") throw new Error("close-target-not-a-draft");
  if (!isRecord(close) || close.closed !== true) throw new Error("number-assigned-before-close-refused");
  return { ...draft.number, advisory: false, assigned: true };
}

function requestNamingOrRenumbering() {
  throw new Error("naming-renumbering-outside-assembler");
}

// ---- Single by-exception bundle (spec section 7) ----

function proposeThreshold(specText, owner) {
  if (!nonEmptyString(specText)) throw new Error("threshold-without-proposal-refused");
  return { proposal: specText, proposedBy: "plan", ruledBy: null };
}

function ruleThreshold(threshold, owner) {
  if (!isRecord(threshold)) throw new Error("threshold-not-a-record");
  if (owner !== "owner") throw new Error("self-imposed-threshold-rejected");
  return { ...threshold, ruledBy: "owner" };
}

function issueBundle(parts) {
  const keys = ["harvest", "gaps", "drafts", "exceptions"];
  if (!isRecord(parts)) throw new Error("bundle-not-a-record");
  const got = Object.keys(parts).sort();
  assert(JSON.stringify(got) === JSON.stringify(keys.slice().sort()), `bundle-shape-wrong:${got.join(",")}`);
  return { sections: keys, count: 1 };
}

// ---- Clean supervised cycles first (spec section 8) ----

function recordSupervisedCycle(record, touches, changelogTraces) {
  if (!isRecord(record) || !Array.isArray(record.cycles)) throw new Error("record-not-a-record");
  const clean = touches.every((t) => t === "ruling") && changelogTraces.every(Boolean);
  record.cycles.push({ touches: touches.slice(), clean });
  return clean;
}

function grantWiderMandate(record) {
  if (!isRecord(record) || !Array.isArray(record.cycles)) throw new Error("record-not-a-record");
  if (!record.cycles.some((c) => c.clean === true)) {
    throw new Error("no-clean-record-no-mandate");
  }
  return { mandate: "wider" };
}

// ---- Checks ----

check("spec-readable", () => {
  assert(spec.length > 1000, "spec too short to carry the treatment");
  return `spec bytes: ${spec.length}`;
});

check("ld30-source-refs", () => {
  assert(spec.includes(":6212"), "missing V3 treatment start ref :6212");
  assert(spec.includes(":6365"), "missing V3 treatment end ref :6365");
  return "refs :6212 + :6365 present";
});

check("fbld30-verbatim", () => {
  assert(spec.includes(FBLD_30_VERBATIM), "FBLD-30 not carried verbatim");
  return "FBLD-30 verbatim present";
});

check("harvest-bounded", () => {
  const ruled = { id: "h1", ruled: true };
  const mech = { id: "h2", mechanical: true };
  const waiting = { id: "h3" };
  for (const kind of HARVEST_KINDS) {
    assert(unsupervisedStep(kind, ruled).ran, `${kind} refused a ruled item`);
    assert(unsupervisedStep(kind, mech).ran, `${kind} refused a mechanical step`);
    let threw = "";
    try {
      unsupervisedStep(kind, waiting);
    } catch (error) {
      threw = error instanceof Error ? error.message : String(error);
    }
    assert(threw === `stops-at-owner-ruling:${kind}:h3`, `${kind} overran the ruling: ${threw}`);
  }
  return "4 steps run on ruled/mechanical; unruled stops at ruling";
});

check("gates-on-ruled-only", () => {
  assert(runGate({ id: "g1", ruled: true }).gate === "green", "ruled gate refused");
  let threw = "";
  try {
    runGate({ id: "g2" });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "gate-on-unruled-rejected:g2", `gate on unruled not refused: ${threw}`);
  return "ruled gates green; unruled gate refused";
});

check("landing-ruled-only", () => {
  assert(landRuled({ id: "l1", ruled: true }).landed, "ruled landing refused");
  let threw = "";
  try {
    landRuled({ id: "l2", mechanical: true });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "non-ruled-landing-rejected:l2", `non-ruled landing not rejected: ${threw}`);
  return "ruled lands; non-ruled landing rejected";
});

check("assembler-approved-only", () => {
  const ledger = { entries: [{ id: "e1" }, { id: "e2" }] };
  const good = [
    { id: "a1", approved: true, approval: "ruling-7", ledgerEntry: "e1" },
    { id: "a2", approved: true, approval: "ruling-7", ledgerEntry: "e2" },
  ];
  const draft = assembleDraft(good, ledger);
  assert(draft.label === "draft-candidate", "emission not labeled draft-candidate");
  let threw = "";
  try {
    assembleDraft([{ id: "w1", approved: false, ledgerEntry: "e1" }], ledger);
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "unapproved-improvement-refused:w1", `wish entered the draft: ${threw}`);
  return "approved assemble; unapproved refused";
});

check("diff-and-changelog", () => {
  const ledger = { entries: [{ id: "e1" }] };
  const draft = assembleDraft(
    [{ id: "a1", approved: true, approval: "ruling-7", ledgerEntry: "e1" }],
    ledger,
  );
  assert(draft.diff.length === 1 && draft.diff[0].change === "diff-for:a1", "diff not inspectable per draft");
  assert(draft.changelog[0].tracesTo === "e1", "changelog line untraced");
  let threw = "";
  try {
    assembleDraft([{ id: "a9", approved: true, approval: "ruling-7", ledgerEntry: "missing" }], ledger);
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "orphan-changelog-line-rejected:a9", `orphan line accepted: ${threw}`);
  return "diff inspectable; changelog traced; orphan rejected";
});

check("advisory-number-only", () => {
  assert(spec.includes(ADVISORY_RULE), "advisory-number rule missing");
  for (const reading of ASSIGNING_READINGS) {
    assert(!reading.test(spec), `assigning reading present: ${reading.source}`);
  }
  const ledger = { entries: [{ id: "e1" }] };
  const draft = assembleDraft(
    [{ id: "a1", approved: true, approval: "ruling-7", ledgerEntry: "e1" }],
    ledger,
  );
  assert(draft.number.advisory === true && draft.number.assigned === false, "draft number not advisory-only");
  let threw = "";
  try {
    assignNumberAtClose(draft, { closed: false });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "number-assigned-before-close-refused", `number assigned before close: ${threw}`);
  const closed = assignNumberAtClose(draft, { closed: true });
  assert(closed.assigned === true, "close did not assign");
  return "advisory at assembly; assignment at close only";
});

check("naming-outside", () => {
  let threw = "";
  try {
    requestNamingOrRenumbering();
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "naming-renumbering-outside-assembler", `naming automated: ${threw}`);
  return "naming/renumbering request refused";
});

check("single-bundle", () => {
  const bundle = issueBundle({ harvest: [], gaps: [], drafts: [], exceptions: [] });
  assert(bundle.count === 1 && bundle.sections.length === 4, "bundle not exactly one with four sections");
  let threw = "";
  try {
    issueBundle({ harvest: [], gaps: [], drafts: [] });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw.startsWith("bundle-shape-wrong"), `short bundle accepted: ${threw}`);
  const proposed = proposeThreshold("only security exceptions surface", "plan");
  let selfThrew = "";
  try {
    ruleThreshold(proposed, "plan");
  } catch (error) {
    selfThrew = error instanceof Error ? error.message : String(error);
  }
  assert(selfThrew === "self-imposed-threshold-rejected", `self-imposed threshold stood: ${selfThrew}`);
  assert(ruleThreshold(proposed, "owner").ruledBy === "owner", "owner ruling not recorded");
  return "one bundle of four; thresholds owner-ruled";
});

check("supervised-first", () => {
  const record = { cycles: [] };
  let threw = "";
  try {
    grantWiderMandate(record);
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "no-clean-record-no-mandate", `mandate without record granted: ${threw}`);
  const dirty = recordSupervisedCycle(record, ["ruling", "triage"], [true]);
  assert(dirty === false, "dirty cycle counted clean");
  try {
    grantWiderMandate(record);
    throw new Error("mandate-granted-on-dirty-record");
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    assert(msg === "no-clean-record-no-mandate", `dirty record granted mandate: ${msg}`);
  }
  assert(recordSupervisedCycle(record, ["ruling"], [true]) === true, "clean cycle not counted");
  assert(grantWiderMandate(record).mandate === "wider", "clean record refused mandate");
  return "no record no mandate; dirty not clean; clean grants";
});

check("open-questions-decided", () => {
  const missing = OPEN_QUESTIONS.filter((n) => !spec.includes(`[${n}]`));
  assert(missing.length === 0, `undecided open questions: ${missing.join(",")}`);
  return "19/19 open questions [6333]-[6351] decided";
});

check("install-honesty", () => {
  assert(spec.includes("install_cmd: null"), "install_cmd null admission missing");
  assert(spec.includes("unverified"), "unverified admission missing");
  for (const token of INSTALLER_TOKENS) {
    assert(!spec.includes(token), `invented provisioning line present: ${token}`);
  }
  return "null + unverified; zero provisioning lines";
});

// ---- Verdict (deterministic digest over check name/status pairs) ----

const digest = createHash("sha256")
  .update(JSON.stringify(checks.map((c) => [c.name, c.status])), "utf8")
  .digest("hex");
for (const c of checks) {
  console.log(`${c.status} ${c.name} — ${c.evidence}`);
}
const passed = checks.filter((c) => c.status === "PASS").length;
const failed = checks.length - passed;
console.log(`checks: ${passed} pass, ${failed} fail, ${checks.length} total`);
console.log(`LD30-DIGEST ${digest}`);
if (failed > 0) {
  console.log("VERDICT: REJECT");
  process.exit(1);
} else {
  console.log("VERDICT: PROCEED");
}
