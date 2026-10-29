// LD-09 shared-export scrub check — Node stdlib only, ESM, zero dependencies.
//
// A shared export is the ONLY supported exchange format (local storage is an
// opaque box, never an exchange path). Every shared export MUST carry the
// format declaration and MUST contain zero unscrubbed content: no secret
// material and no opaque-box references. This module proves that property
// mechanically; its verdict is consumed by restore-probe.mjs.
//
// Usage:
//   node .opencode/audit/BUILD-099/export-scrub.mjs   (self-test, exit 0 on PASS)

import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

export const EXPORT_FORMAT = "vantrilex-export/1";

// Deny-list: shapes that MUST never appear in a shared export.
// - private-key: raw secret material.
// - secret-token: bearer-style tokens.
// - local-opaque-ref: references into the opaque local-storage box, which is
//   never a supported exchange path (V3:3599) and therefore unscrubbed.
const FORBIDDEN = [
  { id: "private-key", pattern: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/ },
  { id: "secret-token", pattern: /\bsk-(?:live|test)-[A-Za-z0-9]{8,}\b/ },
  { id: "local-opaque-ref", pattern: /\blocal-storage-ref:\/\/\S+/ },
];

/**
 * Scan export text. Returns { clean, findings } where findings is a list of
 * { id, detail } records. Non-string input is refused (fail-closed).
 * @param {unknown} text export body to scan
 */
export function scrubExportText(text) {
  if (typeof text !== "string") {
    return {
      clean: false,
      findings: [{ id: "non-string-input", detail: "export body must be a string" }],
    };
  }
  const findings = [];
  if (!text.includes(`format:${EXPORT_FORMAT}`)) {
    findings.push({
      id: "missing-format-declaration",
      detail: `export must declare format:${EXPORT_FORMAT}`,
    });
  }
  for (const rule of FORBIDDEN) {
    if (rule.pattern.test(text)) {
      findings.push({ id: rule.id, detail: `forbidden shape present: ${rule.id}` });
    }
  }
  return { clean: findings.length === 0, findings };
}

// Clean shared-export fixture: declares the format, carries checkpoint data
// only (position plus explicitly-recorded restorable indicators), zero
// secret material, zero opaque-box references.
export const CLEAN_EXPORT_FIXTURE = [
  `format:${EXPORT_FORMAT}`,
  "checkpoint: build-release/0.9.9 msg a1b2c3",
  "position: task-index 4 of 9",
  "indicators: trust-tier=operator grant=read:registry",
  "origin: ledger b099 parent-tree intact",
].join("\n");

// Dirty fixture: same shape plus one opaque-box reference (unscrubbed).
export const DIRTY_EXPORT_FIXTURE = `${CLEAN_EXPORT_FIXTURE}\nnote: see local-storage-ref://session-cache/raw for details`;

const lines = [];
function emit(line) {
  lines.push(line);
  console.log(line);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`self-test FAIL: ${label}: expected ${expected}, got ${actual}`);
  }
}

export function runScrubSelfTest() {
  // 1. Clean fixture passes with zero findings.
  const clean = scrubExportText(CLEAN_EXPORT_FIXTURE);
  assertEqual(clean.clean, true, "scrub.clean-fixture");
  assertEqual(clean.findings.length, 0, "scrub.clean-fixture-findings");
  emit(`SCRUB clean-fixture clean=${clean.clean} findings=${clean.findings.length}`);

  // 2. Dirty fixture is caught with exactly the opaque-ref finding.
  const dirty = scrubExportText(DIRTY_EXPORT_FIXTURE);
  assertEqual(dirty.clean, false, "scrub.dirty-fixture");
  assertEqual(dirty.findings.length, 1, "scrub.dirty-fixture-count");
  assertEqual(dirty.findings[0].id, "local-opaque-ref", "scrub.dirty-fixture-id");
  emit(`SCRUB dirty-fixture clean=${dirty.clean} finding=${dirty.findings[0].id}`);

  // 3. Secret material is caught.
  const secret = scrubExportText(
    `format:${EXPORT_FORMAT}\nkey: -----BEGIN RSA PRIVATE KEY-----`,
  );
  assertEqual(secret.clean, false, "scrub.secret-fixture");
  assertEqual(secret.findings[0].id, "private-key", "scrub.secret-fixture-id");
  emit(`SCRUB secret-fixture clean=${secret.clean} finding=${secret.findings[0].id}`);

  // 4. Missing format declaration is refused.
  const noFormat = scrubExportText("checkpoint: bare text with no declaration");
  assertEqual(noFormat.clean, false, "scrub.no-format");
  assertEqual(noFormat.findings[0].id, "missing-format-declaration", "scrub.no-format-id");
  emit(`SCRUB no-format clean=${noFormat.clean} finding=${noFormat.findings[0].id}`);

  // 5. Non-string input is refused fail-closed.
  const nonString = scrubExportText(null);
  assertEqual(nonString.clean, false, "scrub.non-string");
  emit(`SCRUB non-string clean=${nonString.clean} finding=${nonString.findings[0].id}`);

  const digest = createHash("sha256").update(lines.join("\n")).digest("hex");
  emit(`DIGEST ${digest}`);
  return digest;
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  runScrubSelfTest();
}
