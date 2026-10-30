#!/usr/bin/env node
/**
 * LD-24 self-test checker: policy packs v1 proof (0.9.24).
 * Zero dependencies. Exit 0 only when every check passes.
 * Run: node verify-policy-packs-0924.mjs --self-test (rerunnable by a non-author).
 * Doctrine: FULL under ponytail FLOOR + CEILING (see b0924-build.md ledger).
 *
 * The checker IS the slot's enforcement surface: every binding rule names a
 * point below, and a point counts as real only if a deny conformance fires
 * through it. A rule with no provable point is tagged advisory or refused,
 * never given a fake point.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FBLD_24_VERBATIM = "FBLD-24 \u2014 Slot 0.9.24 \u2014 Conflict: V3 slot scope versus standing risk-tiered auto-approval deferral \u2014 Fallback: run supervised first; delegation only after a clean record \u2014 Matches LD-24 \u2014 Status FLAGGED, never resolved.";
const LD_24_VERBATIM = "LD-24 \u2014 Slot 0.9.24 \u2014 Policy packs v1 \u2014 Treatment: full V3 treatment under heading at (source `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5284`), carried as data \u2014 Conflict FLAGGED: V3 slot scope versus standing risk-tiered auto-approval deferral \u2014 Fallback LD-24: run supervised first; delegation only after a clean record \u2014 Not resolved.";

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
const spec = readFileSync(join(here, "policy-packs-0924.md"), "utf8");

const shaOf = (text) => createHash("sha256").update(text, "utf8").digest("hex");

// ---- Factory pack v1: full factory-hard-rules translation, nothing added ----

const PACK_VERSION = "factory-hard-rules v1 (0.9.24)";

const FACTORY_PACK = {
  name: "factory-hard-rules",
  version: PACK_VERSION,
  suspended: [],
  tombstones: [],
  resolutions: [],
  rules: [
    {
      id: "FHR-01",
      source: "AGENTS.md hard rule 1 (Node-only toolchain)",
      scope: "every package manifest plus every script import in the tree",
      point: "checker:dep-scan",
      severity: "deny",
      verdict: "deny",
      params: {},
    },
    {
      id: "FHR-02",
      source: "AGENTS.md hard rule 2 (catalog markdown is a build artifact)",
      scope: "registry/VANTRILEX_CATALOG.md",
      point: "checker:artifact-hash",
      severity: "deny",
      verdict: "deny",
      params: { artifactPath: "registry/VANTRILEX_CATALOG.md" },
    },
    {
      id: "FHR-03",
      source: "AGENTS.md hard rule 3 (catalog JSON is a derived mirror)",
      scope: "registry/catalog.json",
      point: "checker:artifact-hash",
      severity: "deny",
      verdict: "deny",
      params: { artifactPath: "registry/catalog.json" },
    },
    {
      id: "FHR-04",
      source: "AGENTS.md hard rule 4 (single-writer law)",
      scope: "registry/data/*.jsonl writer claims across the pack set",
      point: "checker:single-writer",
      severity: "deny",
      verdict: "deny",
      params: {},
    },
    {
      id: "FHR-05",
      source: "AGENTS.md hard rule 5 (English only, README pair excepted)",
      scope: "whole tree except README.md and README.ar.md",
      point: "checker:ascii-scan",
      severity: "deny",
      verdict: "deny",
      params: { nonAsciiAllowedIn: ["README.md", "README.ar.md"] },
    },
    {
      id: "FHR-06",
      source: "AGENTS.md hard rule 6 (no placeholders)",
      scope: "whole tree except the rule-definition files that list the tokens",
      point: "checker:placeholder-scan",
      severity: "deny",
      verdict: "deny",
      params: { definitionFiles: ["policy-packs-0924.md", "verify-policy-packs-0924.mjs"] },
    },
    {
      id: "FHR-07",
      source: "AGENTS.md hard rule 7, first sentence (no committed file carries a real value)",
      scope: "whole tree except the rule-definition files",
      point: "checker:secret-scan",
      severity: "deny",
      verdict: "deny",
      params: {
        definitionFiles: ["policy-packs-0924.md", "verify-policy-packs-0924.mjs"],
        registryPrefixes: ["mcp/", "skill/", "agent/", "hook/", "command/", "lsp/", "theme/", "capability/", "eval/", "profile/", "workflow/", "policy/"],
      },
    },
    {
      id: "ADV-01",
      source: "AGENTS.md hard rule 7, second sentence (a leaked credential is revoked first, then removed)",
      scope: "human incident response outside the tree",
      point: null,
      severity: "advisory",
      verdict: null,
      advisory: true,
      advisoryReason: "no provable in-tree point: revocation ordering is a human action outside any file the checker can read, so it is tagged advisory, never given a fake point",
    },
  ],
};

// ---- Enforcement points (each one implemented below, none declared without code) ----

function evalDepScan(tree) {
  for (const [path, content] of Object.entries(tree)) {
    if (path === "__writerClaims__") continue;
    if (path.endsWith("package.json")) {
      let parsed = null;
      try {
        parsed = JSON.parse(content);
      } catch {
        return { matched: true, evidence: `manifest-unparseable:${path}` };
      }
      for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
        if (isRecord(parsed[field]) && Object.keys(parsed[field]).length > 0) {
          return { matched: true, evidence: `added-dependency:${path}:${field}:${Object.keys(parsed[field])[0]}` };
        }
      }
    }
    if (path.endsWith(".mjs") || path.endsWith(".js")) {
      const imports = [...content.matchAll(/from "([^"]+)"/g)].map((m) => m[1]);
      for (const name of imports) {
        if (name.startsWith("node:") || name.startsWith("./") || name.startsWith("../") || name.startsWith("/")) continue;
        return { matched: true, evidence: `bare-import:${path}:${name}` };
      }
    }
  }
  return { matched: false, evidence: "no-added-deps:no-bare-imports" };
}

function evalArtifactHash(tree, rule) {
  const at = rule.params.artifactPath;
  const expected = rule.params.sha256;
  assert(nonEmptyString(at), "artifact rule needs params.artifactPath");
  assert(nonEmptyString(expected), "artifact rule needs params.sha256 pinned");
  if (!(at in tree)) return { matched: true, evidence: `artifact-missing:${at}` };
  if (shaOf(tree[at]) !== expected) return { matched: true, evidence: `artifact-tampered:${at}` };
  return { matched: false, evidence: `artifact-hash-match:${at}` };
}

function evalSingleWriter(tree) {
  if (!("___writerClaims__" in tree) && !("__writerClaims__" in tree)) {
    return { matched: true, evidence: "claims-absent:fail-closed" };
  }
  let claims = null;
  try {
    claims = JSON.parse(tree["__writerClaims__"]);
  } catch {
    return { matched: true, evidence: "claims-unparseable:fail-closed" };
  }
  assert(Array.isArray(claims), "claims must be an array");
  const seen = new Map();
  for (const claim of claims) {
    if (!isRecord(claim) || !nonEmptyString(claim.writer) || !nonEmptyString(claim.sidecar)) {
      return { matched: true, evidence: "claim-without-writer-or-sidecar" };
    }
    if (seen.has(claim.sidecar)) {
      return { matched: true, evidence: `two-writers-one-sidecar:${claim.sidecar}:${seen.get(claim.sidecar)}+${claim.writer}` };
    }
    seen.set(claim.sidecar, claim.writer);
  }
  return { matched: false, evidence: `one-writer-per-sidecar:${seen.size}` };
}

function evalAsciiScan(tree, rule) {
  const allowed = rule.params.nonAsciiAllowedIn || [];
  for (const [path, content] of Object.entries(tree)) {
    if (path === "__writerClaims__") continue;
    if (allowed.some((a) => path === a || path.endsWith("/" + a))) continue;
    if (/[^\x00-\x7F]/.test(content)) return { matched: true, evidence: `non-ascii-outside-readme:${path}` };
  }
  return { matched: false, evidence: "ascii-outside-readme-clean" };
}

function evalPlaceholderScan(tree, rule) {
  const defs = rule.params.definitionFiles || [];
  for (const [path, content] of Object.entries(tree)) {
    if (path === "__writerClaims__") continue;
    if (defs.some((d) => path === d || path.endsWith("/" + d))) continue;
    if (/\b(TODO|FIXME|XXX|HACK)\b/.test(content) || /coming soon/i.test(content)) {
      return { matched: true, evidence: `placeholder-found:${path}` };
    }
  }
  return { matched: false, evidence: "no-placeholders" };
}

function evalSecretScan(tree, rule) {
  const defs = rule.params.definitionFiles || [];
  const prefixes = rule.params.registryPrefixes || [];
  const awsKey = new RegExp("AKIA[0-9A-Z]{16}");
  for (const [path, content] of Object.entries(tree)) {
    if (path === "__writerClaims__") continue;
    if (defs.some((d) => path === d || path.endsWith("/" + d))) continue;
    if (awsKey.test(content)) return { matched: true, evidence: `secret-form-aws-key:${path}` };
    if (/sk-live-[A-Za-z0-9]{16,}/.test(content)) return { matched: true, evidence: `secret-form-live-key:${path}` };
    if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(content)) return { matched: true, evidence: `secret-form-private-key:${path}` };
    const tokenHit = /"(token|apiKey|api_key)"\s*:\s*"([^"]+)"/.exec(content);
    if (tokenHit && !prefixes.some((p) => tokenHit[2].startsWith(p))) {
      return { matched: true, evidence: `secret-form-long-token:${path}` };
    }
  }
  return { matched: false, evidence: "no-real-values" };
}

const POINTS = {
  "checker:dep-scan": evalDepScan,
  "checker:artifact-hash": evalArtifactHash,
  "checker:single-writer": evalSingleWriter,
  "checker:ascii-scan": evalAsciiScan,
  "checker:placeholder-scan": evalPlaceholderScan,
  "checker:secret-scan": evalSecretScan,
};

// ---- Pack shape: schema plus the no-floating-rule gate plus the anti-fake-point gate ----

function checkPackShape(pack) {
  const reasons = [];
  assert(isRecord(pack) && Array.isArray(pack.rules), "pack needs a rules array");
  for (const rule of pack.rules) {
    assert(isRecord(rule) && nonEmptyString(rule.id), "every rule needs a non-empty id");
    assert(nonEmptyString(rule.scope), `rule ${rule.id} needs a scope`);
    assert(nonEmptyString(rule.severity), `rule ${rule.id} needs a severity`);
    if (rule.advisory === true) {
      assert(rule.severity === "advisory", `advisory rule ${rule.id} carries severity advisory`);
      assert(nonEmptyString(rule.advisoryReason), `advisory rule ${rule.id} states why no point exists`);
      continue;
    }
    if (!nonEmptyString(rule.point)) {
      reasons.push(`no-enforcement-point:${rule.id}`);
      continue;
    }
    if (!(rule.point in POINTS)) {
      reasons.push(`unknown-enforcement-point:${rule.id}:${rule.point}`);
      continue;
    }
    assert(rule.verdict === "deny" || rule.verdict === "allow", `binding rule ${rule.id} casts deny or allow`);
  }
  return reasons;
}

// ---- Contradiction: deny versus allow on the same scope and the same point ----

function findContradictions(pack) {
  const binding = pack.rules.filter((r) => r.advisory !== true && nonEmptyString(r.point) && r.point in POINTS);
  const found = [];
  for (let i = 0; i < binding.length; i++) {
    for (let j = i + 1; j < binding.length; j++) {
      const a = binding[i];
      const b = binding[j];
      if (a.scope === b.scope && a.point === b.point && a.verdict !== b.verdict) {
        found.push({ a: a.id, b: b.id, scope: a.scope, point: a.point });
      }
    }
  }
  return found;
}

function findUnresolved(pack) {
  const open = findContradictions(pack);
  const resolvedPairs = new Set(
    (pack.resolutions || []).map((r) => [...r.between].sort().join("<>")),
  );
  return open.filter((c) => !resolvedPairs.has([c.a, c.b].sort().join("<>")));
}

function judgePack(pack) {
  const shapeReasons = checkPackShape(pack);
  const unresolved = findUnresolved(pack);
  for (const c of unresolved) shapeReasons.push(`unresolved-contradiction:${c.a}<>${c.b}@${c.point}`);
  return { accepted: shapeReasons.length === 0, reasons: shapeReasons };
}

// ---- Enforcement entry: the real point every conformance runs through ----

function enforcePack(pack, tree) {
  const suspendedIds = new Set((pack.suspended || []).map((s) => s.id));
  const casts = [];
  const skips = [];
  for (const rule of pack.rules) {
    if (rule.advisory === true) {
      skips.push(`${rule.id}:advisory-not-enforced`);
      continue;
    }
    if (suspendedIds.has(rule.id)) {
      skips.push(`${rule.id}:suspended-skip`);
      continue;
    }
    const fn = POINTS[rule.point];
    if (typeof fn !== "function") {
      casts.push({ rule: rule.id, point: rule.point, verdict: "deny", evidence: "unknown-point:fail-closed" });
      continue;
    }
    const hit = fn(tree, rule);
    if (hit.matched) casts.push({ rule: rule.id, point: rule.point, verdict: rule.verdict, evidence: hit.evidence });
  }
  const denied = casts.some((c) => c.verdict === "deny");
  return { verdict: denied ? "DENY" : "ALLOW", casts, skips };
}

// ---- Suspend / revoke: versioned, reasoned, scoped to the one rule ----

function suspendRule(pack, id, reason) {
  assert(pack.rules.some((r) => r.id === id && r.advisory !== true), `suspend needs a live binding rule: ${id}`);
  assert(nonEmptyString(reason), "suspend needs a reason");
  return { ...pack, version: `${pack.version}+suspend-${id}`, suspended: [...pack.suspended, { id, reason }] };
}

function revokeRule(pack, id, reason) {
  assert(pack.rules.some((r) => r.id === id && r.advisory !== true), `revoke needs a live binding rule: ${id}`);
  assert(nonEmptyString(reason), "revoke needs a reason");
  return {
    ...pack,
    version: `${pack.version}-revoke-${id}`,
    rules: pack.rules.filter((r) => r.id !== id),
    tombstones: [...pack.tombstones, { id, reason }],
  };
}

// ---- Fixture trees: one deny plus one allow per binding rule ----

const CATALOG_ALLOW = "# Vantrilex Catalog\n\nGenerated table, byte-identical to the generator output.\n";
const CATALOG_JSON_ALLOW = '{"generated":true,"rows":2889}\n';

const withHashes = (pack) =>
  ({
    ...pack,
    rules: pack.rules.map((r) =>
      r.point === "checker:artifact-hash"
        ? { ...r, params: { ...r.params, sha256: shaOf(r.params.artifactPath.endsWith(".md") ? CATALOG_ALLOW : CATALOG_JSON_ALLOW) } }
        : r,
    ),
  });

const PACK = withHashes(FACTORY_PACK);

// Every fixture tree carries valid writer claims: enforcePack runs the whole
// pack over one tree, so an allow fixture must satisfy every rule, not just
// its own. Claims absence fails closed by design (see checker:single-writer).
const CLAIMS_OK = JSON.stringify([
  { writer: "factory-pack", sidecar: "registry/data/skills.jsonl" },
  { writer: "factory-pack", sidecar: "registry/data/lsp.jsonl" },
]);

const FIX = {
  "FHR-01-deny": {
    __writerClaims__: CLAIMS_OK,
    "package.json": '{"name":"demo","dependencies":{"left-pad":"1.3.1"}}',
    "scripts/x.mjs": 'import { x } from "node:fs";\n',
  },
  "FHR-01-allow": {
    __writerClaims__: CLAIMS_OK,
    "package.json": '{"name":"demo","private":true}',
    "scripts/x.mjs": 'import { x } from "node:fs";\n',
  },
  "FHR-02-deny": { __writerClaims__: CLAIMS_OK, "registry/VANTRILEX_CATALOG.md": CATALOG_ALLOW + " " },
  "FHR-02-allow": { __writerClaims__: CLAIMS_OK, "registry/VANTRILEX_CATALOG.md": CATALOG_ALLOW },
  "FHR-03-deny": { __writerClaims__: CLAIMS_OK, "registry/catalog.json": CATALOG_JSON_ALLOW.replace("2889", "2890") },
  "FHR-03-allow": { __writerClaims__: CLAIMS_OK, "registry/catalog.json": CATALOG_JSON_ALLOW },
  "FHR-04-deny": {
    __writerClaims__: JSON.stringify([
      { writer: "pack-a", sidecar: "registry/data/skills.jsonl" },
      { writer: "pack-b", sidecar: "registry/data/skills.jsonl" },
    ]),
  },
  "FHR-04-allow": {
    __writerClaims__: JSON.stringify([
      { writer: "pack-a", sidecar: "registry/data/skills.jsonl" },
      { writer: "pack-b", sidecar: "registry/data/lsp.jsonl" },
    ]),
  },
  "FHR-05-deny": { __writerClaims__: CLAIMS_OK, "skills/demo/SKILL.md": "Use when demo runs. \u0645\u0631\u062d\u0628\u0627" },
  "FHR-05-allow": {
    __writerClaims__: CLAIMS_OK,
    "skills/demo/SKILL.md": "Use when demo runs.",
    "README.md": "English line. \u0645\u0631\u062d\u0628\u0627",
  },
  "FHR-06-deny": { __writerClaims__: CLAIMS_OK, "docs/x.md": "Do the thing. TODO: fix later." },
  "FHR-06-allow": { __writerClaims__: CLAIMS_OK, "docs/x.md": "Status: unverified, moving on." },
  "FHR-07-deny": { __writerClaims__: CLAIMS_OK, "cfg/selection.json": `{"note": "backup key ${"AKIA" + "IOSFODNN7EXAMPLE"}"}` },
  "FHR-07-allow": { __writerClaims__: CLAIMS_OK, "cfg/selection.json": '{"token": "skill/verify-01"}' },
};

// Artifact-hash rules fail closed on missing artifacts, so every whole-pack
// fixture must carry the pinned allow-bytes for both artifacts; explicit
// deny entries win by spreading last.
const fullTree = (t) => ({
  "registry/VANTRILEX_CATALOG.md": CATALOG_ALLOW,
  "registry/catalog.json": CATALOG_JSON_ALLOW,
  ...t,
});

const firedBy = (out, id) => out.casts.find((c) => c.rule === id);

// ---- Checks: pack shape (E2 V3:5408) ----

check("pack-schema-required-fields", () => {
  const reasons = checkPackShape(PACK);
  assert(reasons.length === 0, `factory pack shape clean, got: ${reasons.join(";")}`);
  for (const rule of PACK.rules) {
    assert(nonEmptyString(rule.id) && nonEmptyString(rule.scope) && nonEmptyString(rule.severity), `fields present: ${rule.id}`);
  }
  return "8-entries:7-binding-plus-1-advisory:fields-complete";
});

check("rejects-pointless-non-advisory", () => {
  const bad = { ...PACK, rules: [...PACK.rules, { id: "FLOAT-01", scope: "everywhere", severity: "deny", verdict: "deny" }] };
  const reasons = checkPackShape(bad);
  assert(reasons.includes("no-enforcement-point:FLOAT-01"), "floating rule refused by id");
  assert(!judgePack(bad).accepted, "pack with a floating rule is rejected");
  return "no-enforcement-point:FLOAT-01:refused";
});

check("accepts-advisory-without-point", () => {
  const adv = PACK.rules.find((r) => r.id === "ADV-01");
  assert(adv && adv.advisory === true && adv.point === null, "ADV-01 tagged advisory with null point");
  assert(nonEmptyString(adv.advisoryReason), "advisory reason stated");
  return "advisory-tagged:reason-stated:no-fake-point";
});

check("rejects-unimplemented-point", () => {
  const bad = {
    ...PACK,
    rules: [...PACK.rules, { id: "FAKE-01", scope: "s", point: "checker:does-not-exist", severity: "deny", verdict: "deny" }],
  };
  const reasons = checkPackShape(bad);
  assert(reasons.includes("unknown-enforcement-point:FAKE-01:checker:does-not-exist"), "fake point refused by name");
  return "unknown-enforcement-point:refused:never-invented";
});

check("spec-mirrors-code-pack", () => {
  for (const rule of PACK.rules) {
    assert(spec.includes(rule.id), `spec carries ${rule.id}`);
  }
  assert(spec.includes(PACK_VERSION), "spec carries the pack version");
  return "8-ids-in-spec:version-in-spec:no-drift";
});

// ---- Checks: contradiction (E4 V3:5410) ----

const synthPair = (scopeA, scopeB) => ({
  ...PACK,
  rules: [
    { id: "SYN-DENY", scope: scopeA, point: "checker:placeholder-scan", severity: "deny", verdict: "deny", params: { definitionFiles: [] } },
    { id: "SYN-ALLOW", scope: scopeB, point: "checker:placeholder-scan", severity: "allow", verdict: "allow", params: { definitionFiles: [] } },
  ],
});

check("contradiction-same-scope-point-detected", () => {
  const found = findContradictions(synthPair("same-scope", "same-scope"));
  assert(found.length === 1 && found[0].a === "SYN-DENY" && found[0].b === "SYN-ALLOW", "deny-vs-allow same scope+point detected");
  return "deny-vs-allow:same-scope-plus-point:detected";
});

check("no-contradiction-across-scopes", () => {
  const found = findContradictions(synthPair("scope-a", "scope-b"));
  assert(found.length === 0, "different scopes never contradict");
  return "scope-separates:no-contradiction";
});

check("no-contradiction-same-verdict", () => {
  const agree = {
    ...PACK,
    rules: [
      { id: "SYN-D1", scope: "s", point: "checker:placeholder-scan", severity: "deny", verdict: "deny", params: { definitionFiles: [] } },
      { id: "SYN-D2", scope: "s", point: "checker:placeholder-scan", severity: "deny", verdict: "deny", params: { definitionFiles: [] } },
    ],
  };
  assert(findContradictions(agree).length === 0, "agreement is not contradiction");
  return "deny-plus-deny:agreement:not-contradiction";
});

check("resolved-contradiction-accepted-logged", () => {
  const pack = {
    ...synthPair("same-scope", "same-scope"),
    resolutions: [{ between: ["SYN-DENY", "SYN-ALLOW"], winner: "SYN-DENY", reason: "deny wins on safety: over-allow loses data", decidedBy: "pack-owner" }],
  };
  assert(findUnresolved(pack).length === 0, "recorded resolution clears the pair");
  assert(judgePack(pack).accepted, "resolved pair no longer rejects the pack");
  return "resolution-recorded:winner-plus-reason:accepted";
});

check("unresolved-contradiction-rejects-pack", () => {
  const pack = synthPair("same-scope", "same-scope");
  const open = findUnresolved(pack);
  assert(open.length === 1, "unresolved pair stays open");
  const judged = judgePack(pack);
  assert(!judged.accepted && judged.reasons.some((r) => r.startsWith("unresolved-contradiction:SYN-DENY<>SYN-ALLOW")), "rejection names the pair");
  return "unresolved-contradiction:SYN-DENY<>SYN-ALLOW:rejected";
});

check("factory-pack-zero-unresolved", () => {
  assert(findContradictions(PACK).length === 0, "no deny-vs-allow pair shares scope+point in the factory pack");
  assert(PACK.rules.filter((r) => r.advisory !== true).every((r) => r.verdict === "deny"), "all seven binding verdicts are deny, so zero is expected not vacuous");
  assert(findUnresolved(PACK).length === 0, "zero unresolved");
  return "0-contradictions:0-unresolved:all-binding-deny";
});

// ---- Checks: self-test accept plus reject (E5 V3:5411) ----

check("accepts-known-good-pack", () => {
  const judged = judgePack(PACK);
  assert(judged.accepted, `known-good accepted, got: ${judged.reasons.join(";")}`);
  return "known-good:ACCEPT";
});

check("rejects-known-bad-pack", () => {
  const bad = {
    ...synthPair("same-scope", "same-scope"),
    rules: [
      ...synthPair("same-scope", "same-scope").rules,
      { id: "FLOAT-01", scope: "everywhere", severity: "deny", verdict: "deny" },
    ],
  };
  const judged = judgePack(bad);
  assert(!judged.accepted, "known-bad rejected");
  assert(judged.reasons.includes("no-enforcement-point:FLOAT-01"), "rejection quotes the floating rule");
  assert(judged.reasons.some((r) => r.startsWith("unresolved-contradiction:")), "rejection quotes the contradiction");
  return "known-bad:REJECT:floating-plus-contradiction-quoted";
});

// ---- Checks: conformance, every binding rule, through enforcePack (E1 V3:5407, E8 V3:5414) ----

for (const id of ["FHR-01", "FHR-02", "FHR-03", "FHR-04", "FHR-05", "FHR-06", "FHR-07"]) {
  check(`conform-${id}-deny`, () => {
    const out = enforcePack(PACK, fullTree(FIX[`${id}-deny`]));
    assert(out.verdict === "DENY", `${id} deny fixture must DENY through the real point`);
    const hit = firedBy(out, id);
    assert(hit && nonEmptyString(hit.point) && hit.point in POINTS, `${id} fired through its declared point`);
    return `${id}:DENY:via:${hit.point}:${hit.evidence}`;
  });
  check(`conform-${id}-allow`, () => {
    const out = enforcePack(PACK, fullTree(FIX[`${id}-allow`]));
    const hit = firedBy(out, id);
    assert(!hit, `${id} allow fixture must not fire, got: ${hit ? hit.evidence : "none"}`);
    assert(out.verdict === "ALLOW", `${id} allow fixture must ALLOW overall`);
    return `${id}:ALLOW:no-cast`;
  });
}

check("definition-exclusion-honored", () => {
  const out = enforcePack(PACK, fullTree({ __writerClaims__: CLAIMS_OK, "policy-packs-0924.md": "Token list: TODO FIXME XXX HACK coming soon." }));
  assert(!firedBy(out, "FHR-06"), "rule-definition files stay outside the placeholder scope");
  assert(out.verdict === "ALLOW", "exclusion keeps the pack green on its own definition");
  return "definition-files-excluded:scope-honest";
});

// ---- Checks: changelog bridge (E3 V3:5409, E9 V3:5415) ----

const BRIDGE_TRACE = "CHANGELOG.md ## [Unreleased] ### Fixed entry 3 (pre-commit scanner Registry token exemption)";

check("changelog-bridge-entry-checked", () => {
  const candidate = {
    id: "BRIDGE-01",
    source: BRIDGE_TRACE,
    scope: "registry selection records holding kind-prefixed tokens",
    point: "checker:secret-scan",
    severity: "allow",
    verdict: "allow",
    params: {
      definitionFiles: [],
      registryPrefixes: ["mcp/", "skill/", "agent/", "hook/", "command/", "lsp/", "theme/", "capability/", "eval/", "profile/", "workflow/", "policy/"],
    },
  };
  const shape = checkPackShape({ ...PACK, rules: [candidate] });
  assert(shape.length === 0, `bridge candidate well-formed, got: ${shape.join(";")}`);
  const allowOut = enforcePack({ ...PACK, rules: [candidate] }, { "registry/selection.json": '{"token": "skill/verify-01"}' });
  assert(!firedBy(allowOut, "BRIDGE-01"), "kind-prefixed registry token must not fire the scanner");
  const denyOut = enforcePack({ ...PACK, rules: [candidate] }, FIX["FHR-07-deny"]);
  assert(firedBy(denyOut, "BRIDGE-01"), "the same point still fires on a real-form secret: the point is proven, not a rubber stamp");
  assert(!PACK.rules.some((r) => r.id === "BRIDGE-01"), "bridge candidate checked but NOT merged: v1 stays at the factory hard set");
  assert(spec.includes(BRIDGE_TRACE), "trace link carried in the spec");
  return "bridge-candidate:checked:allow-holds-plus-deny-fires:not-merged";
});

// ---- Checks: suspend plus revoke, effect scoped to the one rule (E6 V3:5412) ----

check("suspend-scoped-to-one-rule", () => {
  const held = suspendRule(PACK, "FHR-06", "trial pause while the token list is reviewed");
  assert(held.suspended.some((s) => s.id === "FHR-06" && nonEmptyString(s.reason)), "suspend record carries id plus reason");
  const freed = enforcePack(held, fullTree(FIX["FHR-06-deny"]));
  assert(freed.verdict === "ALLOW" && freed.skips.some((s) => s.startsWith("FHR-06:suspended-skip")), "suspended rule stops firing");
  const others = enforcePack(held, fullTree(FIX["FHR-01-deny"]));
  assert(others.verdict === "DENY" && firedBy(others, "FHR-01"), "every other rule still fires: effect scoped to FHR-06");
  return "suspend:FHR-06:one-rule-quiet:rest-fire";
});

check("revoke-scoped-to-one-rule", () => {
  const cut = revokeRule(PACK, "FHR-05", "superseded by a wider language rule in a later pack");
  assert(!cut.rules.some((r) => r.id === "FHR-05"), "revoked rule leaves the active set");
  assert(cut.tombstones.some((t) => t.id === "FHR-05" && nonEmptyString(t.reason)), "tombstone carries id plus reason");
  const freed = enforcePack(cut, fullTree(FIX["FHR-05-deny"]));
  assert(freed.verdict === "ALLOW", "revoked rule no longer denies");
  const others = enforcePack(cut, fullTree(FIX["FHR-01-deny"]));
  assert(others.verdict === "DENY" && firedBy(others, "FHR-01"), "every other rule still fires: effect scoped to FHR-05");
  return "revoke:FHR-05:tombstoned:one-rule-gone:rest-fire";
});

// ---- Checks: pack description, honesty, fallback (E7 V3:5413) ----

check("pack-described-version-tests-resolutions", () => {
  assert(spec.includes(PACK_VERSION), "version in the description");
  assert(spec.includes("verify-policy-packs-0924.mjs --self-test"), "tests named in the description");
  assert(spec.includes("Resolutions log"), "resolutions log section present");
  for (const id of ["FHR-01", "FHR-02", "FHR-03", "FHR-04", "FHR-05", "FHR-06", "FHR-07", "ADV-01"]) {
    assert(spec.includes(id), `described: ${id}`);
  }
  return "version-plus-tests-plus-resolutions:8-described";
});

check("install-honesty", () => {
  assert(spec.includes("install_cmd: null"), "install_cmd null in spec");
  assert(spec.includes("unverified"), "verification unverified in spec");
  assert(!spec.includes("npm install") && !spec.includes("install -g"), "no invented install string in spec");
  const self = readFileSync(fileURLToPath(import.meta.url), "utf8");
  const selfCode = self.split("\n").filter((line) => !line.includes("matchAll")).join("\n");
  const imported = [...new Set([...selfCode.matchAll(/from "([^"]+)"/g)].map((m) => m[1]))].sort();
  assert(JSON.stringify(imported) === JSON.stringify(["node:crypto", "node:fs", "node:path", "node:url"]), `stdlib-only imports, got: ${imported.join(",")}`);
  return "null-plus-unverified:no-invented-command";
});

check("zero-fetch-local-only", () => {
  const self = readFileSync(fileURLToPath(import.meta.url), "utf8");
  const codeLines = self.split("\n").filter((line) => !line.includes("includes("));
  assert(!codeLines.some((line) => line.includes("fetch(")), "checker performs zero network fetch");
  return "zero-fetch:local-only";
});

check("fbld24-honesty", () => {
  assert(spec.includes(FBLD_24_VERBATIM), "FBLD-24 carried verbatim in spec");
  assert(spec.includes(LD_24_VERBATIM), "LD-24 carried verbatim in spec");
  assert(spec.includes("run supervised first"), "supervised-first precedence");
  assert(spec.includes("delegation only after a clean record"), "delegation gate stated");
  assert(!spec.includes("delegat") || !/delegat\w* (granted|done|complete)/i.test(spec), "no delegation claimed");
  return "fbld24-verbatim:ld24-verbatim:supervised-first:no-delegation-claimed";
});

// ---- Verdict ----

const runSelfTest = () => {
  const fails = checks.filter((c) => c.status === "FAIL");
  const digest = createHash("sha256")
    .update(checks.map((c) => `${c.name}:${c.status}:${c.evidence}`).join("\n"), "utf8")
    .digest("hex");
  for (const c of checks) {
    console.log(`${c.status} ${c.name} :: ${c.evidence}`);
  }
  console.log(`checks: ${checks.length - fails.length} pass, ${fails.length} fail, ${checks.length} total`);
  console.log(`LD24-DIGEST ${digest}`);
  console.log(`VERDICT: ${fails.length === 0 ? "PROCEED" : "FAIL"}`);
  return fails.length === 0 ? 0 : 1;
};

if (process.argv.includes("--self-test")) {
  process.exit(runSelfTest());
} else {
  console.log("usage: node verify-policy-packs-0924.mjs --self-test");
  process.exit(2);
}
