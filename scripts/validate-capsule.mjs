#!/usr/bin/env node
/*
  Vantrilex universal capsule validator.

  Validates one capsule JSON document against the schema family at
  schemas/capsules/capsule.schema.json, which is the single source of
  truth: this script reads that file and enforces it, so the family and
  the enforcement cannot drift apart.

  Referenced by every capsule flow (AETHER MISSION-PLAN, PULSAR findings,
  refusal/escalation, WAKE-REQUEST, OVERRIDE) as:
    node scripts/validate-capsule.mjs <capsule.json>
  Enforcement is detective only: per P1-R0 Verdict 1 (PARKED) no hook
  denies admission, so an invalid capsule is reported with named reasons
  and never silently accepted.

  Usage:
    node scripts/validate-capsule.mjs <capsule.json>
    node scripts/validate-capsule.mjs --self-test

  Exit 0 when the capsule is valid. Exit 1 when the capsule is invalid,
  with one named reason per defect. Exit 2 on usage errors (missing file,
  unreadable JSON, unknown flag). Node 25, ESM, zero dependencies.

  Self-test validates the two shipped fixtures and quotes each exit code:
    schemas/capsules/fixtures/valid.mission-plan.json   (expects exit 0)
    schemas/capsules/fixtures/invalid.mission-plan.json (expects exit 1)
*/

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");
const SCHEMA_PATH = join(ROOT, "schemas", "capsules", "capsule.schema.json");
const FIXTURE_DIR = join(ROOT, "schemas", "capsules", "fixtures");
const VALID_FIXTURE = join(FIXTURE_DIR, "valid.mission-plan.json");
const INVALID_FIXTURE = join(FIXTURE_DIR, "invalid.mission-plan.json");

function isPlainObject(value) {
  return typeof value === "object" && value !== null && Array.isArray(value) === false;
}

function checkType(value, name) {
  if (name === "null") return value === null;
  if (name === "array") return Array.isArray(value);
  if (name === "object") return isPlainObject(value);
  if (name === "string") return typeof value === "string";
  if (name === "integer") return typeof value === "number" && Number.isInteger(value);
  if (name === "number") return typeof value === "number";
  if (name === "boolean") return typeof value === "boolean";
  return false;
}

/* Validate one value against one property schema. Returns an array of
   named reasons; an empty array means the value conforms. */
function checkValue(schema, value, atPath) {
  const reasons = [];
  if (schema === null || typeof schema !== "object" || Array.isArray(schema)) return reasons;
  if (schema.type !== undefined) {
    const names = Array.isArray(schema.type) ? schema.type : [schema.type];
    let matched = false;
    for (const name of names) {
      if (checkType(value, name)) {
        matched = true;
        break;
      }
    }
    if (matched === false) {
      reasons.push(atPath + ": expected type " + names.join(" or "));
      return reasons;
    }
  }
  if (schema.const !== undefined && value !== schema.const) {
    reasons.push(atPath + ": expected constant " + JSON.stringify(schema.const) + ", got " + JSON.stringify(value));
    return reasons;
  }
  if (schema.enum !== undefined && schema.enum.includes(value) === false) {
    reasons.push(atPath + ": value " + JSON.stringify(value) + " is not one of " + JSON.stringify(schema.enum));
    return reasons;
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      reasons.push(atPath + ": string is shorter than minLength " + schema.minLength);
    }
    if (schema.pattern !== undefined) {
      let re = null;
      try {
        re = new RegExp(schema.pattern);
      } catch {
        re = null;
      }
      if (re === null || re.test(value) === false) {
        reasons.push(atPath + ": string does not match pattern " + schema.pattern);
      }
    }
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      reasons.push(atPath + ": number is below minimum " + schema.minimum);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      reasons.push(atPath + ": number is above maximum " + schema.maximum);
    }
  }
  if (Array.isArray(value) && schema.minItems !== undefined && value.length < schema.minItems) {
    reasons.push(atPath + ": array holds " + value.length + " items, minimum is " + schema.minItems);
  }
  if (isPlainObject(value)) {
    if (Array.isArray(schema.required)) {
      for (const key of schema.required) {
        if (Object.hasOwn(value, key) === false) {
          reasons.push(atPath + ": missing required property " + JSON.stringify(key));
        }
      }
    }
    if (isPlainObject(schema.properties)) {
      for (const key of Object.keys(schema.properties)) {
        if (Object.hasOwn(value, key)) {
          reasons.push(...checkValue(schema.properties[key], value[key], atPath + "." + key));
        }
      }
    }
  }
  if (Array.isArray(value) && isPlainObject(schema.items)) {
    for (let i = 0; i < value.length; i++) {
      reasons.push(...checkValue(schema.items, value[i], atPath + "[" + i + "]"));
    }
  }
  return reasons;
}

function loadSchema() {
  let parsed = null;
  try {
    parsed = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
  } catch (err) {
    return { ok: false, error: "cannot read schema family " + SCHEMA_PATH + ": " + String(err) };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "schema family is not a JSON object" };
  }
  if (isPlainObject(parsed.defs) === false || Array.isArray(parsed.types) === false) {
    return { ok: false, error: "schema family carries no defs object and types array" };
  }
  return { ok: true, schema: parsed };
}

function loadCapsule(filePath) {
  let parsed = null;
  try {
    parsed = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (err) {
    return { ok: false, error: "cannot read capsule " + filePath + ": " + String(err) };
  }
  return { ok: true, capsule: parsed };
}

/* Validate one parsed capsule document. Returns { valid, reasons }. */
function validateDocument(schema, doc) {
  if (isPlainObject(doc) === false) {
    return { valid: false, reasons: ["$: capsule document is not a JSON object"] };
  }
  const kind = doc.capsule;
  if (typeof kind !== "string" || kind === "") {
    return { valid: false, reasons: ["$: missing discriminator field \"capsule\" naming one of " + JSON.stringify(schema.types)] };
  }
  if (schema.types.includes(kind) === false) {
    return { valid: false, reasons: ["$.capsule: unknown capsule type " + JSON.stringify(kind) + ", expected one of " + JSON.stringify(schema.types)] };
  }
  const def = schema.defs[kind];
  if (isPlainObject(def) === false) {
    return { valid: false, reasons: ["$.capsule: no definition for capsule type " + JSON.stringify(kind)] };
  }
  const reasons = checkValue(def, doc, "$");
  return { valid: reasons.length === 0, reasons };
}

function validateFile(schema, filePath) {
  const loaded = loadCapsule(filePath);
  if (loaded.ok === false) return { exit: 2, reasons: [loaded.error] };
  const result = validateDocument(schema, loaded.capsule);
  if (result.valid) return { exit: 0, reasons: [] };
  return { exit: 1, reasons: result.reasons };
}

function selfTest() {
  const schemaLoaded = loadSchema();
  if (schemaLoaded.ok === false) {
    process.stderr.write("self-test: FAIL — " + schemaLoaded.error + "\n");
    process.stdout.write("VERDICT: SELF-TEST ERROR — exit 2\n");
    return 2;
  }
  const schema = schemaLoaded.schema;
  const valid = validateFile(schema, VALID_FIXTURE);
  const invalid = validateFile(schema, INVALID_FIXTURE);
  process.stdout.write("self-test: valid fixture " + VALID_FIXTURE + " -> exit " + valid.exit + " (expected 0)\n");
  for (const reason of valid.reasons) process.stderr.write("  ! " + reason + "\n");
  process.stdout.write("self-test: invalid fixture " + INVALID_FIXTURE + " -> exit " + invalid.exit + " (expected 1)\n");
  for (const reason of invalid.reasons) process.stderr.write("  ! " + reason + "\n");
  if (valid.exit === 0 && invalid.exit === 1 && invalid.reasons.length > 0) {
    process.stdout.write("VERDICT: SELF-TEST PASS — exit 0\n");
    return 0;
  }
  process.stdout.write("VERDICT: SELF-TEST FAIL — exit 1\n");
  return 1;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") {
    process.exitCode = selfTest();
    return;
  }
  if (args.length !== 1 || args[0].startsWith("-")) {
    process.stderr.write("usage: node scripts/validate-capsule.mjs <capsule.json> | --self-test\n");
    process.exitCode = 2;
    return;
  }
  const schemaLoaded = loadSchema();
  if (schemaLoaded.ok === false) {
    process.stderr.write("FAIL " + schemaLoaded.error + "\n");
    process.stdout.write("VERDICT: INVALID — schema family unreadable, exit 2\n");
    process.exitCode = 2;
    return;
  }
  const result = validateFile(schemaLoaded.schema, resolve(args[0]));
  if (result.exit === 0) {
    process.stdout.write("VERDICT: VALID — capsule conforms, exit 0\n");
  } else if (result.exit === 1) {
    for (const reason of result.reasons) process.stderr.write("INVALID " + reason + "\n");
    process.stdout.write("VERDICT: INVALID — " + result.reasons.length + " reason(s), exit 1\n");
  } else {
    for (const reason of result.reasons) process.stderr.write("ERROR " + reason + "\n");
    process.stdout.write("VERDICT: ERROR — capsule could not be read, exit 2\n");
  }
  process.exitCode = result.exit;
}

main();
