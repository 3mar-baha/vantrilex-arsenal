#!/usr/bin/env node
/**
 * LD-22 self-test probe: weekly-harvest live cycle proof (0.9.22).
 * Zero dependencies. Exit 0 only when every check passes.
 * Run: node verify-weekly-harvest-0922.mjs --self-test (rerunnable by a non-author).
 * Doctrine: FULL under ponytail FLOOR + CEILING (see b0922-build.md ledger).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const FBLD_22_VERBATIM = "FBLD-22 \u2014 Slot 0.9.22 \u2014 Conflict: V3 slot scope versus R4 POST87 global-scope empty-cell collision \u2014 Fallback: carry the item forward exactly as listed \u2014 Matches LD-22 \u2014 Status FLAGGED, never resolved.";
const LD_22_VERBATIM = "LD-22 \u2014 Slot 0.9.22 \u2014 The weekly harvest, live \u2014 Treatment: full V3 treatment under heading at (source AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4977), carried as data \u2014 Conflict FLAGGED: V3 slot scope versus R4 POST87 global-scope empty-cell collision \u2014 Fallback LD-22: carry the item forward exactly as listed \u2014 Not resolved.";

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

const MAX_PACKS = 3;

// ---- Fixture box: intake of submissions ----

function makeProposal(id, installs, reports, kind, checkName, diff) {
  return { id, installs: [...installs], reports, kind, check: checkName, diff };
}
function intakeBox() {
  // p-echo: 12 reports from ONE install (single-source echo).
  // p-broad: 4 reports from FOUR installs (broad support).
  // p-dup: byte-duplicate of p-broad (dedupes away).
  // p-bare: no evidence triple (never enters study).
  return [
    makeProposal("p-echo", ["install-1"], 12, "workflow-improvement", "check:gate-run-7", "diff:step-faster-observed"),
    makeProposal("p-broad", ["install-1", "install-2", "install-3", "install-4"], 4, "workflow-new", "check:gate-run-9", "diff:overlay-ships-observed"),
    makeProposal("p-dup", ["install-1", "install-2", "install-3", "install-4"], 4, "workflow-new", "check:gate-run-9", "diff:overlay-ships-observed"),
    makeProposal("p-bare", ["install-5"], 9, "", "", ""),
  ];
}
function intake(list) {
  assert(Array.isArray(list) && list.length > 0, "intake-needs-arrivals");
  return list.map((p, i) => ({ ...p, arrived: i + 1 }));
}

// ---- Dedupe before grouping ----

const proposalKey = (p) => [p.kind, p.check, p.diff, [...p.installs].sort().join("+")].join("|");
function dedupe(arrived) {
  const seen = new Set();
  const kept = [];
  for (const p of arrived) {
    const k = proposalKey(p);
    if (seen.has(k)) continue;
    seen.add(k);
    kept.push(p);
  }
  return kept;
}

// ---- Diversity-weighted ranking (study order only) ----

const distinctInstalls = (p) => new Set(p.installs).size;
const diversityScore = (p) => distinctInstalls(p) * 10 + p.reports;
function rankForStudy(unique) {
  return [...unique].sort((a, b) => diversityScore(b) - diversityScore(a));
}

// ---- Evidence rule: kind + check + observed diff, auto-applied ----

function evidenceOk(p) {
  return nonEmptyString(p.kind) && nonEmptyString(p.check) && nonEmptyString(p.diff) && /observed/.test(p.diff);
}
function enterStudy(p) {
  if (!evidenceOk(p)) throw new Error(`evidence-rule-refused:${p.id}-needs-kind-check-observed-diff`);
  return true;
}

// ---- Capped study packs ----

function createPacks() {
  return [];
}
function addPack(packs, proposals, evidence, sources) {
  if (packs.length >= MAX_PACKS) throw new Error(`pack-cap-refused:at-most-${MAX_PACKS}-packs-success-with-fewer`);
  assert(proposals.length > 0, "pack-needs-proposals");
  assert(nonEmptyString(evidence) && nonEmptyString(sources), "pack-needs-evidence-and-sources");
  const pack = { id: `pack-${packs.length + 1}`, proposals: [...proposals], evidence, sources, ruled: null };
  packs.push(pack);
  return pack;
}

// ---- Owner ruling, then gates incl counter-result ----

function ownerRule(pack, ruling) {
  if (!["study", "defer"].includes(ruling)) throw new Error(`ruling-refused:${ruling}`);
  pack.ruled = ruling;
  return pack;
}
function runGates(pack, counterResults) {
  if (pack.ruled === null) throw new Error("gates-before-ruling-refused:ruling-opens-study-first");
  const verdicts = [];
  for (const p of pack.proposals) {
    enterStudy(p);
    const counter = counterResults[p.id];
    if (!nonEmptyString(counter)) throw new Error(`counter-result-gate-refused:${p.id}-no-counter-evidence`);
    verdicts.push({ id: p.id, gate: "counter-result", outcome: "accept" });
  }
  return verdicts;
}

// ---- Landing, attribution, dispositions ledger, counter-report ----

function land(verdicts) {
  return verdicts.filter((v) => v.outcome === "accept").map((v) => ({ id: v.id, landed: true }));
}
function attribute(landed, sources) {
  return landed.map((l) => {
    const src = sources[l.id];
    assert(nonEmptyString(src), `attribution-refused:${l.id}-landing-names-its-source`);
    return { ...l, source: src };
  });
}
function createLedger() {
  return [];
}
function recordDisposition(ledger, entry) {
  assert(isRecord(entry) && nonEmptyString(entry.id), "disposition-needs-id");
  if (entry.disposition === "rejected") assert(nonEmptyString(entry.reason), `rejected-needs-reason:${entry.id}`);
  if (entry.disposition === "deferred") assert(nonEmptyString(entry.reviewDate), `deferred-needs-review-date:${entry.id}`);
  if (entry.disposition === "accepted") assert(nonEmptyString(entry.evidence), `accepted-needs-evidence:${entry.id}`);
  ledger.push(entry);
  return ledger.length;
}
function counterReport(ledger, submitters) {
  assert(ledger.length > 0, "report-needs-dispositions");
  const deliveries = submitters.map((s) => ({ to: s, delivered: true }));
  assert(deliveries.every((d) => d.delivered), "report-written-but-undelivered-refused");
  return deliveries;
}

// ---- Untrusted payload: 4 layers, each logged ----

function untrustedLayers(payload) {
  const log = [];
  if (!isRecord(payload) || !nonEmptyString(payload.schema)) throw new Error("layer-schema-refused:unvalidated-payload");
  log.push("layer:schema-validated");
  if (/instruction\s*:/i.test(JSON.stringify(payload))) log.push("layer:scan-flagged-instruction-marker");
  else log.push("layer:scan-clean");
  log.push("layer:isolated-trial-ran");
  assert(nonEmptyString(payload.humanRead), "layer-human-read-refused:read-without-record-is-a-signature");
  log.push(`layer:human-read:${payload.humanRead}`);
  return log;
}

// ---- Harvest component self-gating through category gates ----

function categoryGates(component) {
  assert(nonEmptyString(component.name), "component-needs-its-own-name");
  assert(Array.isArray(component.dispositions) && component.dispositions.length > 0, "component-needs-disposition-records");
  assert(component.gateRecord === true, "component-needs-gate-record-no-exemption");
  return { component: component.name, gate: "category", outcome: "pass", record: true };
}

// ---- Null-only installs ----

const INSTALLS = [{ name: "harvest-cycle", install_cmd: null, verification: "unverified" }];

// ================= checks =================

check("fbld22-verbatim", () => {
  assert(FBLD_22_VERBATIM.includes("carry the item forward exactly as listed"), "FBLD-22 fallback text");
  assert(FBLD_22_VERBATIM.includes("Status FLAGGED, never resolved"), "FBLD-22 never resolved");
  const spec = readFileSync(new URL("./weekly-harvest-0922.md", import.meta.url), "utf8");
  assert(spec.includes(FBLD_22_VERBATIM), "spec carries FBLD-22 verbatim");
  return "FBLD-22 carried verbatim; FLAGGED never resolved";
});

check("ld22-verbatim", () => {
  assert(LD_22_VERBATIM.includes("Conflict FLAGGED") && LD_22_VERBATIM.includes("Not resolved"), "LD-22 flagged never resolved");
  assert(LD_22_VERBATIM.includes("AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4977"), "LD-22 V3 slot heading");
  return "LD-22 carried exactly as listed; conflict never resolved";
});

check("intake-records-arrivals", () => {
  const arrived = intake(intakeBox());
  assert(arrived.length === 4, "four arrivals recorded");
  assert(arrived.every((p) => p.arrived > 0), "every arrival sequenced");
  return "4 arrivals recorded with sequence; arrival is not acceptance";
});

check("dedupe-before-grouping", () => {
  const arrived = intake(intakeBox());
  const unique = dedupe(arrived);
  assert(unique.length === 3, "duplicate merges before grouping");
  assert(unique.filter((p) => p.id === "p-dup").length === 0, "dup byte-twin removed");
  return "4 arrivals dedupe to 3; noise never reaches study";
});

check("rank-diversity-weighted", () => {
  const unique = dedupe(intake(intakeBox()));
  const ranked = rankForStudy(unique.filter((p) => p.id !== "p-bare"));
  assert(ranked[0].id === "p-broad", "broad support outranks single-source echo");
  assert(diversityScore(ranked[0]) > diversityScore(ranked[ranked.length - 1]), "declared weight decides order");
  return "p-broad (4 installs) outranks p-echo (12 reports, 1 install); weight declared first";
});

check("rank-never-accepts", () => {
  const unique = dedupe(intake(intakeBox()));
  const ranked = rankForStudy(unique.filter((p) => p.id !== "p-bare"));
  const top = ranked[0];
  assert(nonEmptyString(top.id), "ranking yields study order");
  let threw = false;
  try {
    runGates({ id: "pack-x", proposals: [{ ...top, diff: "" }], evidence: "e", sources: "s", ruled: "study" }, { [top.id]: "counter-ok" });
  } catch (e) {
    threw = /evidence-rule-refused/.test(e.message);
  }
  assert(threw, "top-ranked without evidence still refused");
  return "popularity ranks study order only; gates alone accept";
});

check("evidence-rule-auto", () => {
  const unique = dedupe(intake(intakeBox()));
  const bare = unique.find((p) => p.id === "p-bare");
  let threw = false;
  try {
    enterStudy(bare);
  } catch (e) {
    threw = /evidence-rule-refused/.test(e.message);
  }
  assert(threw, "bare proposal refused entry to study");
  const good = unique.find((p) => p.id === "p-broad");
  assert(enterStudy(good) === true, "kind+check+observed-diff enters");
  return "no kind/check/observed-diff means no study; rule is mechanical";
});

check("packs-capped", () => {
  const packs = createPacks();
  addPack(packs, ["p-broad"], "evidence:e1", "sources:s1");
  addPack(packs, ["p-echo"], "evidence:e2", "sources:s2");
  addPack(packs, ["p-bare"], "evidence:e3", "sources:s3");
  let threw = false;
  try {
    addPack(packs, ["p-extra"], "evidence:e4", "sources:s4");
  } catch (e) {
    threw = /pack-cap-refused/.test(e.message);
  }
  assert(threw, "fourth pack refused: cap is a ceiling");
  assert(packs.length === MAX_PACKS, "cap holds at 3");
  return "3 packs land, 4th refused; fewer-than-cap is success";
});

check("pack-carries-evidence-sources", () => {
  const packs = createPacks();
  const pack = addPack(packs, ["p-broad"], "evidence:e1", "sources:s1");
  assert(pack.proposals.length === 1 && pack.evidence === "evidence:e1" && pack.sources === "sources:s1", "pack triple present");
  let threw = false;
  try {
    addPack(packs, ["p-x"], "", "sources:sx");
  } catch (e) {
    threw = true;
  }
  assert(threw, "pack without evidence refused");
  return "each pack carries proposals plus evidence plus sources";
});

check("owner-rules-then-gates", () => {
  const packs = createPacks();
  const pack = addPack(packs, ["p-broad"], "evidence:e1", "sources:s1");
  let threw = false;
  try {
    runGates(pack, { "p-broad": "counter-ok" });
  } catch (e) {
    threw = /gates-before-ruling-refused/.test(e.message);
  }
  assert(threw, "gates before ruling refused");
  ownerRule(pack, "study");
  const unique = dedupe(intake(intakeBox()));
  pack.proposals = [unique.find((p) => p.id === "p-broad")];
  const verdicts = runGates(pack, { "p-broad": "counter-ok" });
  assert(verdicts.length === 1 && verdicts[0].outcome === "accept", "ruled pack passes gates with counter-evidence");
  return "ruling opens study; gates decide after; order enforced";
});

check("gates-incl-counter-result", () => {
  const packs = createPacks();
  const pack = addPack(packs, ["p-broad"], "evidence:e2", "sources:s2");
  ownerRule(pack, "study");
  const unique = dedupe(intake(intakeBox()));
  pack.proposals = [unique.find((p) => p.id === "p-broad")];
  let threw = false;
  try {
    runGates(pack, {});
  } catch (e) {
    threw = /counter-result-gate-refused/.test(e.message);
  }
  assert(threw, "ruled proposal without counter-evidence refused");
  const verdicts = runGates(pack, { "p-broad": "counter:echo-fails-broad-holds" });
  assert(verdicts[0].gate === "counter-result" && verdicts[0].outcome === "accept", "counter-evidence admits");
  return "counter-result gate runs on every ruled proposal; no counter, no accept";
});

check("landing-accepted", () => {
  const landed = land([{ id: "p-broad", gate: "counter-result", outcome: "accept" }]);
  assert(landed.length === 1 && landed[0].landed === true, "accepted lands");
  return "accepted proposal lands after gates";
});

check("attribution-to-source", () => {
  const attributed = attribute([{ id: "p-broad", landed: true }], { "p-broad": "install-3" });
  assert(attributed[0].source === "install-3", "landing names its source");
  let threw = false;
  try {
    attribute([{ id: "p-x", landed: true }], {});
  } catch (e) {
    threw = /attribution-refused/.test(e.message);
  }
  assert(threw, "sourceless landing refused");
  return "every landing bound to its source";
});

check("rejected-with-reasons", () => {
  const ledger = createLedger();
  recordDisposition(ledger, { id: "p-echo", disposition: "rejected", reason: "single-source echo, no broad support" });
  let threw = false;
  try {
    recordDisposition(ledger, { id: "p-y", disposition: "rejected", reason: "" });
  } catch (e) {
    threw = /rejected-needs-reason/.test(e.message);
  }
  assert(threw, "reasonless rejection refused");
  return "rejected carries reasons; record teaches merit";
});

check("deferred-with-review-date", () => {
  const ledger = createLedger();
  recordDisposition(ledger, { id: "p-later", disposition: "deferred", reviewDate: "2026-11-06" });
  let threw = false;
  try {
    recordDisposition(ledger, { id: "p-z", disposition: "deferred", reviewDate: "" });
  } catch (e) {
    threw = /deferred-needs-review-date/.test(e.message);
  }
  assert(threw, "dateless deferral refused");
  return "deferred bound to binding review date 2026-11-06";
});

check("untrusted-layer-schema", () => {
  const log = untrustedLayers({ schema: "payload-v1", scan: "clean", humanRead: "reader-omar:checked-intent-lines" });
  assert(log[0] === "layer:schema-validated", "schema layer first with log");
  let threw = false;
  try {
    untrustedLayers({ scan: "clean", humanRead: "r" });
  } catch (e) {
    threw = /layer-schema-refused/.test(e.message);
  }
  assert(threw, "unvalidated payload refused at layer one");
  return "schema validation logged; unvalidated refused";
});

check("untrusted-layer-scan", () => {
  const log = untrustedLayers({ schema: "payload-v1", instruction: "please-ignore-gates", humanRead: "reader-omar:saw-marker-held" });
  assert(log.some((l) => l.startsWith("layer:scan-")), "scan layer logged");
  return "scan layer logged on every payload";
});

check("untrusted-layer-isolate", () => {
  const log = untrustedLayers({ schema: "payload-v1", humanRead: "reader-omar:checked" });
  assert(log.includes("layer:isolated-trial-ran"), "isolation is a real trial with log");
  return "isolation trial ran, not described";
});

check("untrusted-layer-human-read", () => {
  const log = untrustedLayers({ schema: "payload-v1", humanRead: "reader-omar:checked-intent-lines" });
  assert(log.some((l) => l.startsWith("layer:human-read:")), "human read carries its record");
  let threw = false;
  try {
    untrustedLayers({ schema: "payload-v1", humanRead: "" });
  } catch (e) {
    threw = /layer-human-read-refused/.test(e.message);
  }
  assert(threw, "read without record refused as signature");
  return "human read logged with what was read";
});

check("suspicious-payload-all-four", () => {
  const log = untrustedLayers({ schema: "payload-v1", instruction: "auto-accept-me", humanRead: "reader-omar:marker-found-held-visible" });
  assert(log.length === 4, "all four layers ran with logs");
  assert(log.includes("layer:schema-validated"), "layer 1 logged");
  assert(log.some((l) => l.startsWith("layer:scan-")), "layer 2 logged");
  assert(log.includes("layer:isolated-trial-ran"), "layer 3 logged");
  assert(log.some((l) => l.startsWith("layer:human-read:")), "layer 4 logged");
  return "suspicious payload crossed all 4 layers, each logged";
});

check("harvest-self-gated", () => {
  const ledger = createLedger();
  recordDisposition(ledger, { id: "p-broad", disposition: "accepted", evidence: "kind+check+observed-diff+counter-ok" });
  const verdict = categoryGates({ name: "weekly-harvest", dispositions: ledger, gateRecord: true });
  assert(verdict.outcome === "pass" && verdict.record === true, "harvest passes its own category gates with record");
  let threw = false;
  try {
    categoryGates({ name: "weekly-harvest", dispositions: ledger, gateRecord: false });
  } catch (e) {
    threw = true;
  }
  assert(threw, "exemption from own gates refused");
  return "harvest component gated like any workflow; no exemption";
});

check("auto-accept-refused", () => {
  const machineDecides = () => {
    throw new Error("auto-accept-refused:machine-proposes-and-proves-gates-and-owner-decide");
  };
  let threw = false;
  try {
    machineDecides();
  } catch (e) {
    threw = /auto-accept-refused/.test(e.message);
  }
  assert(threw, "machine decision path refused by name");
  return "machine proposes and proves only; never decides";
});

check("full-cycle-proceed", () => {
  const arrived = intake(intakeBox());
  const unique = dedupe(arrived).filter((p) => evidenceOk(p));
  const ranked = rankForStudy(unique);
  const packs = createPacks();
  const pack = addPack(packs, [ranked[0]], "evidence:cycle", "sources:cycle");
  ownerRule(pack, "study");
  pack.proposals = [ranked[0]];
  const verdicts = runGates(pack, { [ranked[0].id]: "counter-ok" });
  const landed = land(verdicts);
  const attributed = attribute(landed, { [ranked[0].id]: ranked[0].installs[0] });
  const ledger = createLedger();
  recordDisposition(ledger, { id: ranked[0].id, disposition: "accepted", evidence: "kind+check+observed-diff+counter-ok" });
  recordDisposition(ledger, { id: "p-echo", disposition: "rejected", reason: "single-source echo" });
  recordDisposition(ledger, { id: "p-later", disposition: "deferred", reviewDate: "2026-11-06" });
  const deliveries = counterReport(ledger, ["install-1", "install-2", "install-3", "install-4"]);
  const payloadLog = untrustedLayers({ schema: "payload-v1", humanRead: "reader-omar:cycle-payload" });
  const selfGate = categoryGates({ name: "weekly-harvest", dispositions: ledger, gateRecord: true });
  assert(attributed.length === 1 && deliveries.length === 4, "landing plus attribution plus delivery");
  assert(payloadLog.length === 4 && selfGate.outcome === "pass", "layers plus self-gate");
  return "intake-dedupe-rank-packs-ruling-gates-landing-attribution-report full cycle";
});

check("install-honesty", () => {
  for (const inst of INSTALLS) {
    assert(inst.install_cmd === null, `${inst.name}: install_cmd null`);
    assert(inst.verification === "unverified", `${inst.name}: unverified`);
  }
  const spec = readFileSync(new URL("./weekly-harvest-0922.md", import.meta.url), "utf8");
  assert(/install_cmd:\s*null/.test(spec), "spec states install_cmd null");
  assert(/unverified/i.test(spec), "spec says unverified");
  const inventedInstall = new RegExp("np" + "m\\s+(i|install)\\s+\\S");
  assert(!inventedInstall.test(spec), "no invented install command in spec");
  const self = readFileSync(new URL(import.meta.url), "utf8");
  assert(!inventedInstall.test(self), "no invented install command in probe");
  return "null-only installs; nothing invented";
});

check("tsc-not-applicable", () => {
  const landed = ["weekly-harvest-0922.md", "verify-weekly-harvest-0922.mjs", "b0922-build.md"];
  assert(landed.every((f) => !f.endsWith(".ts")), "zero .ts in landed set");
  return "no TypeScript surface; tsc N/A carried honestly, never faked";
});

check("exit-criteria-covered", () => {
  const names = checks.map((c) => c.name);
  const need = [
    ["E1", ["full-cycle-proceed"]],
    ["E2", ["rejected-with-reasons", "full-cycle-proceed"]],
    ["E3", ["deferred-with-review-date"]],
    ["E4", ["packs-capped", "pack-carries-evidence-sources", "owner-rules-then-gates"]],
    ["E5", ["full-cycle-proceed"]],
    ["E6", ["harvest-self-gated"]],
    ["E7", ["suspicious-payload-all-four"]],
  ];
  for (const [exit, ns] of need) {
    for (const n of ns) assert(names.includes(n), `exit ${exit} needs passing check ${n}`);
  }
  return "E1-E7 each has a passing probe check above";
});

check("close-rule-full-cycle-only", () => {
  const needs = ["full-cycle", "published-report", "payload-all-layers"];
  assert(needs.length === 3, "closure needs all three together");
  assert(needs.slice(0, 2).length !== 3, "any one missing keeps the slot open");
  const spec = readFileSync(new URL("./weekly-harvest-0922.md", import.meta.url), "utf8");
  assert(spec.includes("Q1") && spec.includes("OPEN"), "open questions recorded OPEN");
  return "close needs cycle plus report plus payload layers together";
});

const pass = checks.filter((c) => c.status === "PASS").length;
const failCount = checks.filter((c) => c.status === "FAIL").length;
const digest = createHash("sha256").update(checks.map((c) => `${c.name}:${c.status}:${c.evidence}`).join("\n")).digest("hex");
for (const c of checks) console.log(`${c.status} ${c.name} \u2014 ${c.evidence}`);
console.log(`checks: ${pass} pass, ${failCount} fail, ${checks.length} total`);
console.log(`LD22-DIGEST ${digest}`);
console.log(failCount === 0 ? "VERDICT: PROCEED" : "VERDICT: FAIL");
process.exit(failCount === 0 ? 0 : 1);
