#!/usr/bin/env node
/*
 * Facet switcher (MFT-113) — one seat, three facets.
 *
 * One seat (`.opencode/agents/vantrilex-facet.md`), three facets
 * (cautious / balanced / long): same thinking, different required
 * permissions. As soon as the facet is changed from the list/menu, the
 * permissions change automatically: `set` rewrites the seat file's
 * `facet:` field and `permission:` block to the selected facet's
 * reference block, and the host/overlay enforce the new block on the next
 * evaluation.
 *
 * Usage:
 *   node scripts/switch-facet.mjs list
 *   node scripts/switch-facet.mjs set <cautious|balanced|long>
 * Exit status:
 *   0 — listed or switched
 *   2 — usage error or unknown facet
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FACETS = ['cautious', 'balanced', 'long'];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEAT_PATH = path.join(root, '.opencode', 'agents', 'vantrilex-facet.md');

const FACET_BLOCKS = {
  cautious: `permission:
  edit: deny
  bash: deny
  task: deny
  question: allow
  read: allow
  glob: allow
  grep: allow`,
  balanced: `permission:
  edit: ask
  bash: ask
  task: ask
  question: allow
  read: allow
  glob: allow
  grep: allow`,
  long: `permission:
  edit: allow
  bash:
    "*": allow
    "rm -rf*": deny
    "git push --force*": deny
  task: allow
  question: allow
  read: allow
  glob: allow
  grep: allow`,
};

const readSeat = () => {
  if (!fs.existsSync(SEAT_PATH)) {
    console.error('vantrilex-facet.md is missing');
    process.exit(1);
  }
  return fs.readFileSync(SEAT_PATH, 'utf8');
};

const activeFacet = (text) => {
  const m = text.match(/^facet:\s*(\S+)/m);
  return m ? m[1] : 'balanced';
};

const setFacet = (facet) => {
  const text = readSeat();
  const block = FACET_BLOCKS[facet];
  // Replace the facet line.
  let next = text.replace(/^facet:\s*\S+/m, `facet: ${facet}`);
  // Replace the permission block (from `permission:` until the next top-level `---`).
  next = next.replace(/^permission:[\s\S]*?(?=\n---)/m, `${block}\n`);
  fs.writeFileSync(SEAT_PATH, next);
  console.log(`facet: ${facet} (permissions updated for ${facet})`);
};

const usage = () => {
  console.error('Usage: node scripts/switch-facet.mjs list');
  console.error('       node scripts/switch-facet.mjs set <cautious|balanced|long>');
};

const main = () => {
  const argv = process.argv.slice(2);
  if (argv.length === 1 && argv[0] === 'list') {
    const current = activeFacet(readSeat());
    for (const f of FACETS) console.log(`${f}${f === current ? ' (active)' : ''}`);
    return;
  }
  if (argv.length === 2 && argv[0] === 'set') {
    if (!FACETS.includes(argv[1])) {
      console.error(`unknown facet "${argv[1]}" — expected one of: ${FACETS.join(', ')}`);
      process.exit(2);
    }
    setFacet(argv[1]);
    return;
  }
  usage();
  process.exit(2);
};

main();
