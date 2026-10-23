# Vantrilex Install Prompt

Paste this prompt once into a fresh agent session to install the Vantrilex
Arsenal from its canonical repository. It clones a pinned tag, orients the
machine exactly once, equips one target project, proves the install with the
real verifiers, and reports three sections. It never invents a command,
never paraphrases a verifier, and never proceeds past a decision without
the owner.

## Prompt text

```text
Install the Vantrilex Arsenal in this project from its canonical source.

1. Clone the pinned tag, or create nothing. Run exactly:
   git clone --branch v0.4.1 --depth 1 https://github.com/3mar-baha/vantrilex-arsenal.git
   Inside the clone, run `git rev-parse HEAD` and report the id verbatim.
   When the network is unavailable, report the clone step SKIPPED with the
   reason and stop; never substitute a mirror, a fork, or a remembered tree.

2. Orient this machine exactly once with `vantrilex-prime`. Read its
   SKILL.md in the clone, follow P.1 through P.8 in order, and report the
   orientation table. Prime runs once per machine; when this machine is
   already oriented, say so in one line and move on.

3. Equip this project with `vantrilex-vanguard`. State detection first,
   then kit selection, then install with real commands only. A component
   with no verified command is recorded `unverified` with a null command;
   a guessed command is a defect, not an install.

4. Prove the install, or refuse the handoff:
   - the BLAZAR roster resolves: `.opencode/agents/blazar.md` plus every
     specialist it dispatches to is present on disk with a matching
     frontmatter name;
   - the skills prove out: paste the output and exit code of
     `node scripts/verify-skills.mjs` as printed;
   - the guard plugin is registered: the session-start, pre-compact, and
     task-dispatcher hooks resolve to functions in
     `.opencode/plugin/arsenal.ts`.
   A check that cannot be evaluated is a failed check. A failed check
   refuses the handoff; fix it or report it, never route around it.

5. Verify-or-refuse before reporting done: run `node scripts/verify-catalog.mjs`
   and `node scripts/verify-registry.mjs`, paste both outputs with their
   exit codes, and refuse the done state while either is non-zero.

6. Stop-and-ask on decisions. Kit selection, verification failures, and the
   docs gate each wait for an explicit owner answer. No gate is assumed
   approved.

Report exactly these three sections, in this order:

[INSTALLED]
<every component installed, one per line with its real command, or NONE>

[VERIFIED]
<every verifier output pasted as printed with its exit code, or REFUSED>

[OPEN ITEMS]
<every pending decision or failure, owned and dated, or NONE>
```

## Why this shape

The pinned tag keeps every install reproducible; Prime-once keeps
orientation from repeating per project; Vanguard-in-project keeps the kit
fitted to the tree it lands on. The three proof obligations (roster,
skills, guard plugin) are the smallest set that shows the Arsenal is
 actually installed rather than merely cloned. Verify-or-refuse keeps a
red gate from becoming a reported pass. Stop-and-ask keeps owner
decisions owned. The three-section report keeps the outcome readable in
one screen: what landed, what proved it, and what is still open.
