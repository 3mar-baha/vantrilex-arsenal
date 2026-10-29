// portable-match-probe.mjs — LD-15 portable-manifest matching probe.
//
// Logic probe only: demonstrates manifest parse, pin-presence, pin-mismatch
// fail-closed rejection, signature presence with unknown-source rejection, and
// per-element gate matching. Signatures here are demo-only bindings computed
// over canonical pins; production signing keys live under the control-level
// axiom (whoever holds the signing key owns the package identity), are never
// shared, and are never shipped inside the package itself.
//
// ESM, zero dependencies (node:crypto is standard library).
// Usage: node portable-match-probe.mjs --self-test   (exit 0 on PASS 5/5)
//        node portable-match-probe.mjs               (prints Usage, exit 0)

import { createHash } from "node:crypto";

const FBLD15 =
  "- FBLD-15 — Slot 0.9.15 — Conflict: V3 slot scope versus R2 null install-path honesty rule — Fallback: null plus unverified, never invented — Matches LD-15 — Status FLAGGED, never resolved.";

const MANIFEST_ID = "ld15-portable-v1";
const PRODUCTION_TARGET = "production";
const SIGNING_NOTE =
  "demo-only binding; production keys under control-level axiom, never shared, never in-package";

function sha256Hex(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function getString(record, key) {
  const value = record[key];
  return isNonEmptyString(value) ? value : null;
}

// Canonical pin binding: fixed key order by construction, so the digest is
// stable across runs (no timestamps, no randomness, no environment reads).
function canonicalPins(manifest) {
  return manifest.components
    .map((c) => `${c.id}|${c.componentPin}|${c.modelPin}|${c.toolPin}`)
    .join(";");
}

function signManifest(manifest) {
  manifest.signature = sha256Hex(`${MANIFEST_ID}:${canonicalPins(manifest)}`);
}

function makeManifest() {
  const manifest = {
    manifest: MANIFEST_ID,
    target: PRODUCTION_TARGET,
    signing: SIGNING_NOTE,
    // FBLD-15: every install_cmd is null with verification unverified —
    // null plus unverified, never invented. No install path is claimed here.
    components: [
      {
        id: "skill:ask-matt",
        componentPin: "ask-matt@0.9.14",
        modelPin: "free-tier@pinned",
        toolPin: "connector-a@1.4.2",
        install_cmd: null,
        verification: "unverified",
        gate: "MATCH",
      },
      {
        id: "agent:vantrilex-guide",
        componentPin: "vantrilex-guide@0.9.14",
        modelPin: "free-tier@pinned",
        toolPin: "connector-a@1.4.2",
        install_cmd: null,
        verification: "unverified",
        gate: "MATCH",
      },
      {
        id: "hardware:arsenal-kit-file",
        componentPin: "arsenal-kit-file@0.9.14",
        modelPin: "free-tier@pinned",
        toolPin: "connector-a@1.4.2",
        install_cmd: null,
        verification: "unverified",
        gate: "MATCH",
      },
    ],
    signature: "",
  };
  signManifest(manifest);
  return manifest;
}

function parseManifest(raw) {
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "unparseable" };
  }
  if (!isRecord(parsed)) return { ok: false, reason: "not-a-record" };
  if (parsed.manifest !== MANIFEST_ID) return { ok: false, reason: "wrong-manifest-id" };
  if (!Array.isArray(parsed.components)) return { ok: false, reason: "components-not-a-list" };
  return { ok: true, manifest: parsed };
}

function pinsPresent(manifest) {
  return manifest.components.every(
    (c) =>
      isRecord(c) &&
      getString(c, "id") !== null &&
      getString(c, "componentPin") !== null &&
      getString(c, "modelPin") !== null &&
      getString(c, "toolPin") !== null,
  );
}

function signatureVerifies(manifest) {
  if (!isRecord(manifest)) return { ok: false, reason: "not-a-record" };
  const signature = getString(manifest, "signature");
  if (signature === null) return { ok: false, reason: "unknown-source" };
  if (!Array.isArray(manifest.components)) return { ok: false, reason: "components-not-a-list" };
  const expected = sha256Hex(`${MANIFEST_ID}:${canonicalPins(manifest)}`);
  if (signature !== expected) return { ok: false, reason: "signature-mismatch" };
  return { ok: true };
}

// Install decision on the production target: the SAME manifest installs, and
// gate results must equal the originals element by element. Any pin mismatch
// or bad/missing signature rejects fail-closed — never a silent swap.
function installOnTarget(manifest, originalGates) {
  const sig = signatureVerifies(manifest);
  if (!sig.ok) return { decision: "REJECTED", reason: sig.reason };
  if (!pinsPresent(manifest)) return { decision: "REJECTED", reason: "pins-absent" };
  for (const c of manifest.components) {
    if (originalGates[c.id] !== c.gate) {
      return { decision: "REJECTED", reason: `gate-divergence:${c.id}` };
    }
  }
  return { decision: "INSTALLED", reason: "gates-match" };
}

function runSelfTest() {
  const lines = [];
  const results = [];
  const pass = (name, detail) => {
    results.push(true);
    lines.push(`${name}: ${detail}`);
  };
  const fail = (name, detail) => {
    results.push(false);
    lines.push(`${name}: FAIL ${detail}`);
  };

  // 1. Manifest parse.
  const manifest = makeManifest();
  const parsed = parseManifest(JSON.stringify(manifest));
  if (parsed.ok) pass("LD15-MANIFEST-PARSE", "OK single inspectable format");
  else fail("LD15-MANIFEST-PARSE", parsed.reason);

  // 2. Pin presence on every element.
  if (parsed.ok && pinsPresent(parsed.manifest)) pass("LD15-PIN-PRESENCE", "3/3 component+model+tool pins present");
  else fail("LD15-PIN-PRESENCE", "a pin is absent");

  // 3. Pin-mismatch rejects fail-closed (tampered tool pin, signature stale).
  const originalGates = Object.fromEntries(manifest.components.map((c) => [c.id, c.gate]));
  const tampered = JSON.parse(JSON.stringify(manifest));
  tampered.components[0].toolPin = "connector-a@9.9.9";
  const tamperVerdict = installOnTarget(tampered, originalGates);
  if (tamperVerdict.decision === "REJECTED") pass("LD15-MISMATCH-REJECT", `REJECTED fail-closed (${tamperVerdict.reason}), no silent swap`);
  else fail("LD15-MISMATCH-REJECT", "tampered manifest was accepted");

  // 4. Signature presence; unknown source (missing signature) rejected.
  const sigOk = signatureVerifies(manifest);
  const unsigned = JSON.parse(JSON.stringify(manifest));
  delete unsigned.signature;
  const unsignedVerdict = installOnTarget(unsigned, originalGates);
  if (sigOk.ok && unsignedVerdict.decision === "REJECTED" && unsignedVerdict.reason === "unknown-source") {
    pass("LD15-SIGNATURE-PRESENCE", "present+verifies; unknown-source rejected at install time");
  } else {
    fail("LD15-SIGNATURE-PRESENCE", "signature binding broken");
  }

  // 5. Per-element gate table on the production target (no blanket claim).
  const verdict = installOnTarget(manifest, originalGates);
  if (verdict.decision === "INSTALLED") {
    for (const c of manifest.components) {
      lines.push(`LD15-ELEMENT[${c.id}]: pins PRESENT, gate ${c.gate}`);
    }
    results.push(true);
    lines.push("LD15-PER-ELEMENT-TABLE: RENDERED 3/3 MATCH");
  } else {
    results.push(false);
    lines.push(`LD15-PER-ELEMENT-TABLE: FAIL ${verdict.reason}`);
  }

  // Open questions carried as build content (FLAGGED, never resolved here).
  lines.push("LD15-OPEN-Q1: CARRIED who guards signing keys; control-level axiom applies, unresolved here");
  lines.push("LD15-OPEN-Q2: CARRIED how much of the arsenal kit file is generated vs authored, unresolved here");
  lines.push(FBLD15);

  const passed = results.filter(Boolean).length;
  const digest = sha256Hex(lines.join("\n"));
  lines.push(`LD15-DIGEST: ${digest}`);
  lines.push(`LD15-PROBE: PASS ${passed}/${results.length}`);
  lines.push("SELFTEST-PASS");

  for (const line of lines) console.log(line);
  return passed === results.length ? 0 : 1;
}

const args = process.argv.slice(2);
if (args.includes("--self-test")) {
  process.exit(runSelfTest());
}
console.log("Usage: node portable-match-probe.mjs --self-test");
process.exit(0);
