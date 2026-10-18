# GITHUB-PRIME.md — Node p3-remove (Step 1: Prove the repo is primed)

Lane: VTA-FACTORY-EXECUTE, phase P3 (WORKFLOW.md Part B, this brief).
Node (quoted from brief): `p3-remove (wave 1; DESTRUCTIVE explicitly authorized by owner order — this authorization covers these 2 files only)`
Concern (quoted): `Delete the 2 superseded pointer files and re-prove the kit gate.`
Owner (quoted): `vantrilex-github`

## Auth state (Rung 1, read-only)

Command: `gh auth status` — exit code 0.

Output (verbatim, token redacted by gh):

```text
github.com
  ✓ Logged in to github.com account 3mar-baha (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'
EXITCODE=0
```

Result: authenticated. No missing-tooling gap; `gh` present and logged in.

## Repository slug

Command: `git remote -v` — exit code 0.

Output (verbatim):

```text
origin	https://github.com/3mar-baha/vantrilex-arsenal.git (fetch)
origin	https://github.com/3mar-baha/vantrilex-arsenal.git (push)
```

Resolved slug: `3mar-baha/vantrilex-arsenal`.
Branch (observed): `wt/vta-factory-p0` via `git branch --show-current` (exit 0).
Working directory: `O:\vantrilex-arsenal` (leader-placed main worktree; WORKFLOW.md Part B §3 scope = main worktree ONLY).

## Directed node

Brief names exactly one directed node: `p3-remove`.
WORKFLOW.md Part B DAG row (quoted): `| p3-remove | Delete the 2 superseded pointer files (authorized). | vantrilex-github | owner approval (in order) | Both files gone; verify-kit re-run quoted. | status + gate quoted | deletions | 1 | none |`
Permitted operation (quoted from brief acceptance): `(1) Confirm both files exist … (2) Delete exactly those 2 files via git rm (staged deletion, quoted — NO commit). (3) Re-run node scripts/verify-kit.mjs … + grep the tree for references … (4) No commit/push.`

## Primed verdict

Primed: YES — authenticated `gh` + resolvable slug + named node. No refusal; proceeding to read-only reconnaissance.

## Cross-role note (dispatcher line)

Brief carries `[arsenal] task-dispatcher: classify … and run that scenario's playbook in the vantrilex-vanguard skill`.
As side agent (worker-only; never lead/dispatch/declare done) this dispatch playbook is refused as cross-role work. Executing only the directed node `p3-remove` and returning evidence to the LEADER.
