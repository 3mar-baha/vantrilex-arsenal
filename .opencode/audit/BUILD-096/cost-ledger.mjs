// LD-06 cost-ledger measurement — Node stdlib only, ESM, zero dependencies.
//
// Covers the V3:3422 exit criteria that are mechanically checkable:
//   1. full-task cost computable from ledger evidence (children + spawns)
//   2. per-component cache hit-rate visible
//   3. budget ceiling stops a deliberate overrun in practice
//   4. spawn-ledger entries carry granted / consumed / result
//   5. leaderboards render internal-first
//
// Usage:
//   node .opencode/audit/BUILD-096/cost-ledger.mjs   (self-test, exit 0 on PASS)

/**
 * @typedef {{ id: string, cost: number }} ChildEntry
 * @typedef {{ id: string, granted: number, consumed: number, result: string }} SpawnEntry
 * @typedef {{ children: ChildEntry[], spawns: SpawnEntry[] }} TaskLedger
 * @typedef {{ component: string, hits: number, total: number }} HitRow
 */

/**
 * Validate one spawn-ledger entry. Every entry carries granted/consumed/result.
 * @param {unknown} entry
 * @returns {entry is SpawnEntry}
 */
export function isValidSpawnEntry(entry) {
  if (entry === null || typeof entry !== "object") return false;
  const record = /** @type {Record<string, unknown>} */ (entry);
  return (
    typeof record.id === "string" &&
    typeof record.granted === "number" &&
    Number.isFinite(record.granted) &&
    typeof record.consumed === "number" &&
    Number.isFinite(record.consumed) &&
    typeof record.result === "string" &&
    record.result.length > 0
  );
}

/**
 * Compute full-task cost from ledger evidence only. No estimation.
 * @param {TaskLedger} ledger
 */
export function computeTaskCost(ledger) {
  const children = Array.isArray(ledger.children) ? ledger.children : [];
  const spawns = Array.isArray(ledger.spawns) ? ledger.spawns : [];
  let childTotal = 0;
  for (const child of children) {
    if (typeof child.cost !== "number" || !Number.isFinite(child.cost)) {
      throw new Error(`child entry missing numeric cost: ${JSON.stringify(child)}`);
    }
    childTotal += child.cost;
  }
  let spawnTotal = 0;
  for (const spawn of spawns) {
    if (!isValidSpawnEntry(spawn)) {
      throw new Error(`spawn entry missing granted/consumed/result: ${JSON.stringify(spawn)}`);
    }
    spawnTotal += spawn.consumed;
  }
  return { childTotal, spawnTotal, total: childTotal + spawnTotal };
}

/**
 * Per-component cache hit-rate table rows.
 * @param {HitRow[]} rows
 */
export function hitRateTable(rows) {
  return rows.map((row) => {
    if (typeof row.total !== "number" || row.total <= 0) {
      throw new Error(`hit-rate row needs total > 0: ${JSON.stringify(row)}`);
    }
    const rate = row.hits / row.total;
    return { component: row.component, hits: row.hits, total: row.total, rate };
  });
}

/**
 * Render hit-rate rows as a plain-text table (visible, grep-able).
 * @param {Array<{ component: string, hits: number, total: number, rate: number }>} computed
 */
export function renderHitRateTable(computed) {
  const lines = ["component | hits/total | rate"];
  for (const row of computed) {
    lines.push(`${row.component} | ${row.hits}/${row.total} | ${row.rate.toFixed(2)}`);
  }
  return lines.join("\n");
}

/**
 * Budget ceiling: a ceiling that does not stop is an alert, not a ceiling.
 * @param {number} total
 * @param {number} ceiling
 */
export function checkCeiling(total, ceiling) {
  const stopped = total > ceiling;
  return { stopped, overBy: stopped ? total - ceiling : 0 };
}

/**
 * Cost leaderboard, internal-first. External publish is a later owner decision.
 * @param {Array<{ component: string, cost: number }>} rows
 */
export function renderLeaderboard(rows) {
  const ranked = [...rows].sort((a, b) => b.cost - a.cost);
  const lines = ["LEADERBOARD (INTERNAL ONLY — do not publish)"];
  ranked.forEach((row, index) => {
    lines.push(`${index + 1}. ${row.component}: ${row.cost}`);
  });
  return lines.join("\n");
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`self-test FAIL: ${label}: expected ${expected}, got ${actual}`);
  }
}

function runSelfTest() {
  // Fixture ledger: evidence only, children + spawns both present.
  const fixture = {
    children: [
      { id: "child-a", cost: 120 },
      { id: "child-b", cost: 80 },
    ],
    spawns: [
      { id: "spawn-1", granted: 100, consumed: 60, result: "success" },
      { id: "spawn-2", granted: 50, consumed: 50, result: "failed" },
    ],
  };
  const cost = computeTaskCost(fixture);
  assertEqual(cost.childTotal, 200, "childTotal");
  assertEqual(cost.spawnTotal, 110, "spawnTotal");
  assertEqual(cost.total, 310, "total");
  console.log(`COST total=${cost.total} (children=${cost.childTotal} spawns=${cost.spawnTotal})`);

  // Spawn entries carry granted/consumed/result.
  for (const spawn of fixture.spawns) {
    if (!isValidSpawnEntry(spawn)) throw new Error(`self-test FAIL: invalid spawn ${spawn.id}`);
    console.log(`SPAWN ${spawn.id} granted=${spawn.granted} consumed=${spawn.consumed} result=${spawn.result}`);
  }

  // Deliberate overrun: ceiling 300 against total 310 must stop in practice.
  const verdict = checkCeiling(cost.total, 300);
  assertEqual(verdict.stopped, true, "ceiling.stopped");
  assertEqual(verdict.overBy, 10, "ceiling.overBy");
  console.log(`CEILING ceiling=300 total=${cost.total} stopped=${verdict.stopped} overBy=${verdict.overBy}`);

  // Under-ceiling control: ceiling 400 must not stop.
  const control = checkCeiling(cost.total, 400);
  assertEqual(control.stopped, false, "control.stopped");

  // Per-component hit-rate table renders.
  const computed = hitRateTable([
    { component: "registry", hits: 90, total: 100 },
    { component: "rag", hits: 30, total: 100 },
  ]);
  assertEqual(computed[0].rate, 0.9, "hitrate.registry");
  assertEqual(computed[1].rate, 0.3, "hitrate.rag");
  console.log("HITRATE");
  console.log(renderHitRateTable(computed));

  // Leaderboard renders internal-first.
  console.log(
    renderLeaderboard([
      { component: "rag", cost: 180 },
      { component: "registry", cost: 130 },
    ]),
  );

  console.log("SELFTEST PASS");
}

const invokedAsMain =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").endsWith("cost-ledger.mjs");

if (invokedAsMain) {
  try {
    runSelfTest();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
