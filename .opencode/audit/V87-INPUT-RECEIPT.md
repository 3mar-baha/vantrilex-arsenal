# V87 INPUT RECEIPT — `i-inputs` (wave 0 of 3)

- **Lane:** V87-AETHER-EXECUTE
- **Node:** `i-inputs` (depends_on none — owner gate closed)
- **Owner:** vantrilex-librarian (worker-only seat; proposes nothing, writes nothing outside this file)
- **Classification:** Scenario 1 NEW TASK — directed node. The Vanguard phase-kit plan is already fixed by the dispatcher, so this node runs the authentication pass only; it derives no phase-kit map and dispatches no work of its own.
- **Date of check:** 2026-10-18
- **Kit version:** not named by the dispatch. This receipt makes zero catalog claims and cites zero catalog ids, so the version-qualification rule is satisfied vacuously; no kit version is guessed.
- **Scope of write:** this file only. `docs/spec/v87/**` is read-only for this node.

## 1. Acceptance table — 7 rows, one per supplied input

Line counting basis: byte-exact newline count (`0x0A`), plus 1 when the final line is unterminated. All seven files end with a newline, so the basis equals the number of text lines. Declared counts are the numbers carried by the dispatch; they are not adjusted here.

| file | declared lines | actual line count | strict-UTF-8 valid y/n (no BOM) | SHA-256 | verdict |
|---|---|---|---|---|---|
| `docs/spec/v87/worker-1-plan-handoff.md` | 104 | 104 | y (no BOM) | `61ce0189feb8325526e7b235e75b49aa061c97f7956a9f72cc2530ef1a9bfc00` | match |
| `docs/spec/v87/worker-2-verification.md` | 112 | 112 | y (no BOM) | `6342d8e284985fa62f90c475557735ee0d420b90df02c4b82506d343c9d08f8e` | match |
| `docs/spec/v87/worker-3-memory.md` | 197 | 197 | y (no BOM) | `514e422659119e8a748e2eb4c8e373c018e864dd918942e12e65baf6dff6cc22` | match |
| `docs/spec/v87/worker-4-decomposition.md` | 181 | 181 | y (no BOM) | `a737a55bf70ded52d0bfa4b3ae36284c1749b88dda36293fbb2461d262199412` | match |
| `docs/spec/v87/worker-5-human-gates.md` | 131 | 172 | y (no BOM) | `0439a344b68d09ad6fb1d80b13332dba9e5db8967570f00ff926c4e7aa631384` | mismatch |
| `docs/spec/v87/SYNTHESIS-v8.7.md` | 420 | 420 | y (no BOM) | `f63d06dca059d3aa0114d30e6276d469f2ed191f82a07b811f75b703a03eb4ae` | match |
| `docs/spec/v87/instagram-v8.7-context.md` | none-declared | 24 | y (no BOM) | `c0e3c67f8efc56a5aa5b2a82bf889b48befe20be3730702cd4ae7dbbf0d3094e` | no-target |

**Summary:** 7/7 present · 5 matches · 1 unexplained mismatch (`worker-5-human-gates.md`, declared 131, actual 172, delta +41) · 1 no-target (`instagram-v8.7-context.md`, no declared count).

All seven files are strict UTF-8 with zero BOM sequences anywhere in the bytes (leading BOM `n`, total BOM sequences `0`).

## 2. Identity proof — first heading line, quoted verbatim

Every file's first heading sits on line 1. Quoted byte-for-byte from the decoded text. Every input file carries `cr_bytes=0` (§5), so the byte stream is LF-only and the CR-strip in the check is a no-op in practice.

- `worker-1-plan-handoff.md` → `# WORKFLOW-RESEARCHER-1 — Plan-to-Execution Handoff`
- `worker-2-verification.md` → `# WORKFLOW-RESEARCHER-2 — Mechanical Verification Loops (v8.7 deep dive)`
- `worker-3-memory.md` → `# WORKFLOW-RESEARCHER-3 — Memory and Context Across Project Lifecycle`
- `worker-4-decomposition.md` → `# WORKER-4: Phase and Task Decomposition — Deep Findings`
- `worker-5-human-gates.md` → `# WORKER-5 — Human-AI Decision Points & Release Discipline`
- `SYNTHESIS-v8.7.md` → `# SYNTHESIS-v8.7 — Real Programmer Workflows with AI: Evidence for Arsenal v8.7`
- `instagram-v8.7-context.md` → `# Instagram Posts — v8.7 Planning Context (2026-10-18)`

## 3. Commands run — quoted with output and exit

Working directory for every command: `O:\vantrilex-arsenal`.

### 3.1 Line counts per file

```
@'
import fs from "node:fs";
import path from "node:path";
const d = "docs/spec/v87";
for (const f of fs.readdirSync(d).sort()) {
  const b = fs.readFileSync(path.join(d, f));
  let nl = 0;
  for (let i = 0; i < b.length; i++) if (b[i] === 10) nl++;
  const un = b.length > 0 && b[b.length - 1] !== 10;
  const lines = nl + (un ? 1 : 0);
  console.log(`${f} | bytes=${b.length} | newlines=${nl} | unterminated_last_line=${un ? "yes" : "no"} | actual_lines=${lines}`);
}
'@ | node --input-type=module
```

```
SYNTHESIS-v8.7.md | bytes=28369 | newlines=420 | unterminated_last_line=no | actual_lines=420
instagram-v8.7-context.md | bytes=1869 | newlines=24 | unterminated_last_line=no | actual_lines=24
worker-1-plan-handoff.md | bytes=16224 | newlines=104 | unterminated_last_line=no | actual_lines=104
worker-2-verification.md | bytes=11705 | newlines=112 | unterminated_last_line=no | actual_lines=112
worker-3-memory.md | bytes=15909 | newlines=197 | unterminated_last_line=no | actual_lines=197
worker-4-decomposition.md | bytes=14510 | newlines=181 | unterminated_last_line=no | actual_lines=181
worker-5-human-gates.md | bytes=13104 | newlines=172 | unterminated_last_line=no | actual_lines=172
```

exit=0

### 3.2 Encoding check — strict UTF-8, BOM detection

```
@'
import fs from "node:fs";
import path from "node:path";
const d = "docs/spec/v87";
for (const f of fs.readdirSync(d).sort()) {
  const b = fs.readFileSync(path.join(d, f));
  const bom = b.length >= 3 && b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF;
  let valid = true;
  let err = "";
  try { new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(b); }
  catch (e) { valid = false; err = e.message; }
  let inner = 0;
  for (let i = 0; i + 2 < b.length; i++) if (b[i] === 0xEF && b[i+1] === 0xBB && b[i+2] === 0xBF) inner++;
  console.log(`${f} | utf8_strict_valid=${valid ? "y" : "n"}${err ? " (" + err + ")" : ""} | leading_BOM=${bom ? "y" : "n"} | BOM_sequences_total=${inner}`);
}
'@ | node --input-type=module
```

```
SYNTHESIS-v8.7.md | utf8_strict_valid=y | leading_BOM=n | BOM_sequences_total=0
instagram-v8.7-context.md | utf8_strict_valid=y | leading_BOM=n | BOM_sequences_total=0
worker-1-plan-handoff.md | utf8_strict_valid=y | leading_BOM=n | BOM_sequences_total=0
worker-2-verification.md | utf8_strict_valid=y | leading_BOM=n | BOM_sequences_total=0
worker-3-memory.md | utf8_strict_valid=y | leading_BOM=n | BOM_sequences_total=0
worker-4-decomposition.md | utf8_strict_valid=y | leading_BOM=n | BOM_sequences_total=0
worker-5-human-gates.md | utf8_strict_valid=y | leading_BOM=n | BOM_sequences_total=0
```

exit=0

### 3.3 SHA-256 per file

```
@'
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const d = "docs/spec/v87";
for (const f of fs.readdirSync(d).sort()) {
  const b = fs.readFileSync(path.join(d, f));
  console.log(`${crypto.createHash("sha256").update(b).digest("hex")}  ${f}`);
}
'@ | node --input-type=module
```

```
f63d06dca059d3aa0114d30e6276d469f2ed191f82a07b811f75b703a03eb4ae  SYNTHESIS-v8.7.md
c0e3c67f8efc56a5aa5b2a82bf889b48befe20be3730702cd4ae7dbbf0d3094e  instagram-v8.7-context.md
61ce0189feb8325526e7b235e75b49aa061c97f7956a9f72cc2530ef1a9bfc00  worker-1-plan-handoff.md
6342d8e284985fa62f90c475557735ee0d420b90df02c4b82506d343c9d08f8e  worker-2-verification.md
514e422659119e8a748e2eb4c8e373c018e864dd918942e12e65baf6dff6cc22  worker-3-memory.md
a737a55bf70ded52d0bfa4b3ae36284c1749b88dda36293fbb2461d262199412  worker-4-decomposition.md
0439a344b68d09ad6fb1d80b13332dba9e5db8967570f00ff926c4e7aa631384  worker-5-human-gates.md
```

exit=0

### 3.4 Identity heads — first heading line and its line number

```
@'
import fs from "node:fs";
import path from "node:path";
const d = "docs/spec/v87";
for (const f of fs.readdirSync(d).sort()) {
  const s = fs.readFileSync(path.join(d, f), "utf8");
  const lines = s.split("\n");
  const i = lines.findIndex((l) => /^#{1,6} /.test(l.replace(/\r$/, "")));
  console.log(`${f} | first_heading_line_number=${i + 1} | ${JSON.stringify(lines[i].replace(/\r$/, ""))}`);
}
'@ | node --input-type=module
```

```
SYNTHESIS-v8.7.md | first_heading_line_number=1 | "# SYNTHESIS-v8.7 — Real Programmer Workflows with AI: Evidence for Arsenal v8.7"
instagram-v8.7-context.md | first_heading_line_number=1 | "# Instagram Posts — v8.7 Planning Context (2026-10-18)"
worker-1-plan-handoff.md | first_heading_line_number=1 | "# WORKFLOW-RESEARCHER-1 — Plan-to-Execution Handoff"
worker-2-verification.md | first_heading_line_number=1 | "# WORKFLOW-RESEARCHER-2 — Mechanical Verification Loops (v8.7 deep dive)"
worker-3-memory.md | first_heading_line_number=1 | "# WORKFLOW-RESEARCHER-3 — Memory and Context Across Project Lifecycle"
worker-4-decomposition.md | first_heading_line_number=1 | "# WORKER-4: Phase and Task Decomposition — Deep Findings"
worker-5-human-gates.md | first_heading_line_number=1 | "# WORKER-5 — Human-AI Decision Points & Release Discipline"
```

exit=0

## 4. The mismatch — exact numbers, not smoothed

`docs/spec/v87/worker-5-human-gates.md`

- Declared: **131** lines (dispatch, `w5=131`).
- Actual: **172** lines (newline count 172, final line terminated).
- Delta: **+41** lines. No file is missing, no file is truncated, nothing was repaired.
- Verdict: **mismatch**, unexplained by evidence in the input set.

What the checks refute as an explanation (facts, not inference):

1. **Not a counting-basis difference.** Non-blank lines in `worker-5-human-gates.md` = 135, which is not 131. Non-blank counts for the other files are 77 / 85 / 156 / 136 / 300 / 20 — none of the declared numbers align with a non-blank basis either.
2. **No in-set note explains the count.** A literal search for `131` across `docs/spec/v87/` returns 0 matches, so no input file records the number or a revision that would explain it.
3. **The file is structurally complete, not malformed.** It carries six sections: §5 `CONCRETE CITATIONS INDEX` opens at line 141 and §6 `v8.7 IMPLICATIONS (for Aether's planning)` opens at line 165. Both sit past line 131, which is where the declared count would have stopped. This is an observation about layout; this node does not assert a cause, because no artifact in the input set states one.

Consequence for the lane, stated without acting on it: wave 0 authenticates the file as present, valid UTF-8, and byte-identical to its recorded hash, but the declared line count does not authenticate. Whether `worker-5` was amended after the dispatch declaration, or the declaration carried a stale number, is a dispatcher/owner decision. This node reports the delta and stops; it does not re-count the declaration into agreement and edits nothing.

## 5. Post-write identity re-check

Re-ran the §3.3 hash pass after this receipt was written, and again after its final edit, adding a CR count to the same pass:

```
@'
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const d = "docs/spec/v87";
for (const f of fs.readdirSync(d).sort()) {
  const b = fs.readFileSync(path.join(d, f));
  let cr = 0;
  for (const x of b) if (x === 13) cr++;
  console.log(`${crypto.createHash("sha256").update(b).digest("hex")}  ${f}  cr_bytes=${cr}`);
}
'@ | node --input-type=module
```

```
f63d06dca059d3aa0114d30e6276d469f2ed191f82a07b811f75b703a03eb4ae  SYNTHESIS-v8.7.md  cr_bytes=0
c0e3c67f8efc56a5aa5b2a82bf889b48befe20be3730702cd4ae7dbbf0d3094e  instagram-v8.7-context.md  cr_bytes=0
61ce0189feb8325526e7b235e75b49aa061c97f7956a9f72cc2530ef1a9bfc00  worker-1-plan-handoff.md  cr_bytes=0
6342d8e284985fa62f90c475557735ee0d420b90df02c4b82506d343c9d08f8e  worker-2-verification.md  cr_bytes=0
514e422659119e8a748e2eb4c8e373c018e864dd918942e12e65baf6dff6cc22  worker-3-memory.md  cr_bytes=0
a737a55bf70ded52d0bfa4b3ae36284c1749b88dda36293fbb2461d262199412  worker-4-decomposition.md  cr_bytes=0
0439a344b68d09ad6fb1d80b13332dba9e5db8967570f00ff926c4e7aa631384  worker-5-human-gates.md  cr_bytes=0
```

exit=0

All seven hashes are unchanged and byte-identical to the table in §1, so `docs/spec/v87/**` was not touched by this node. The receipt file is the only write performed. Receipt self-state: 221 lines, no BOM, strict UTF-8 (measured before this same-line wording fix, which does not change the line count).

## 6. Bounds observed

- Zero edits to the seven inputs; zero writes outside `.opencode/audit/V87-INPUT-RECEIPT.md`.
- No git operations performed.
- No state files read or written.
- Zero catalog ids emitted, therefore the integrity gate has nothing to resolve and nothing was invented.
- Missing-tooling protocol not needed: all four required checks ran and exited 0.

Ponytail: curation spirit binding (FULL binds code-writing nodes only; this node wrote no code) — 7/7 inputs re-hashed identical after the single receipt write, zero content edits, one unexplained mismatch reported with exact numbers.
