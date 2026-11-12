# Tier-2 dispositions — 2026-11-12 (WS3, F-08)

Companion to `docs/dev/tier-2-scope-2026-11-12.md`. Everything this lane
found that it must NOT fix on its own authority, with the reason. Files are
left byte-identical; each stopped file carries no `t2-v1` ledger stamp.
Recorded at HEAD `5da436e` before the batch loop started.

## Stopped cards

| file | rule breached | upstream truth / reason | needed ruling |
|---|---|---|---|
| `registry/skills/brev-etiquette.md` | 3 — absolute path | `**Description:**` is upstream verbatim from `NVIDIA/skills`: "…NeMo-RL agents working in /home/ubuntu/RL with limited workspace disk, a larger /ephemeral volume…" — the `/home/ubuntu/RL` token describes the environment the skill targets; removing or paraphrasing it rewrites upstream text, which this lane never does | owner ruling: accept the upstream `/home/ubuntu` tokens as permitted content for this card, or authorise an upstream-prose edit with its own row replacement |

The card is left byte-identical (no trailing-newline fix either — a stopped
file is not half-fixed). It is skipped by the ledger for the whole loop;
if the ruling lands mid-lane, a single follow-up batch can stamp it.

## Duplicate verbatim `**Description:**` group

One group, 72 cards, all carrying the literal first-line value `>-`
(a YAML folded-scalar marker with **no content line at all**):

```
achieving-cmmc-level-2-compliance, analyzing-ios-app-security-with-objection,
analyzing-kubernetes-audit-logs, auditing-foundry-smart-contract-security,
auditing-kubernetes-rbac-privilege-escalation, benchmarking-kubernetes-with-kube-bench,
conducting-cyber-risk-assessment-with-nist-800-30, conducting-gdpr-compliance-assessment,
deploying-cloud-deception-with-decoy-resources, designing-adversary-engagement-with-mitre-engage,
detecting-container-drift-at-runtime, detecting-container-escape-attempts,
detecting-container-escape-with-falco-rules, detecting-container-runtime-threats-with-falco,
detecting-privilege-escalation-in-kubernetes-pods, escaping-containers-to-host,
executing-nist-rmf-authorization-to-operate, exploiting-api-injection-vulnerabilities,
exploiting-aws-with-pacu, exploiting-broken-function-level-authorization,
exploiting-broken-link-hijacking, exploiting-constrained-delegation-abuse,
exploiting-excessive-data-exposure-in-api, exploiting-http-request-smuggling,
exploiting-idor-vulnerabilities, exploiting-jwt-algorithm-confusion-attack,
exploiting-kerberoasting-with-impacket, exploiting-mass-assignment-in-rest-apis,
exploiting-ms17-010-eternalblue-vulnerability, hardening-docker-containers-for-production,
hardening-docker-daemon-configuration, implementing-container-image-minimal-base-with-distroless,
implementing-container-network-policies-with-calico, implementing-hipaa-security-rule-safeguards,
implementing-image-provenance-verification-with-cosign, implementing-iso-27001-information-security-management,
implementing-just-in-time-access-provisioning, implementing-jwt-signing-and-verification,
implementing-kubernetes-network-policy-with-calico, implementing-kubernetes-pod-security-standards,
implementing-log-forwarding-with-fluentd, implementing-log-integrity-with-blockchain,
implementing-network-policies-for-kubernetes, implementing-opa-gatekeeper-for-policy-enforcement,
implementing-pod-security-admission-controller, implementing-rbac-hardening-for-kubernetes,
implementing-runtime-security-with-tetragon, implementing-supply-chain-security-with-in-toto,
managing-third-party-vendor-risk, performing-container-escape-detection,
performing-container-security-scanning-with-trivy, performing-docker-bench-security-assessment,
performing-kubernetes-cis-benchmark-with-kube-bench, performing-kubernetes-etcd-security-assessment,
performing-kubernetes-penetration-testing, performing-ssl-stripping-attack,
performing-ssl-tls-inspection-configuration, performing-ssl-tls-security-assessment,
performing-ssrf-vulnerability-exploitation, performing-static-malware-analysis-with-pe-studio,
performing-steganography-detection, performing-supply-chain-attack-simulation,
performing-threat-intelligence-sharing-with-misp, performing-threat-landscape-assessment-for-sector,
performing-threat-modeling-with-owasp-threat-dragon, performing-timeline-reconstruction-with-plaso,
performing-vlan-hopping-attack, scanning-container-images-with-grype,
scanning-docker-images-with-trivy, scanning-kubernetes-manifests-with-kubesec,
securing-container-registry-with-harbor, securing-helm-chart-deployments
```

All 72 resolve to `mukul975/Anthropic-Cybersecurity-Skills` — one upstream
source whose bulk-imported cards carry the empty folded-scalar marker where a
description belongs. The cards are otherwise well-formed (Kind/Source/Tags/
Raw URL present, https Raw URLs). Per owner-brief rule 4, the descriptions
are **not edited**; per the never-invent law, replacement prose cannot be
authored here. The `t2-v1` stamp claims only the six mechanical rules — it
does not claim these descriptions are meaningful. Needed ruling: mark the 72
rows `unverified` (or otherwise disposition them) in the catalog, or accept
them as upstream-carried rows with the marker recorded.

Limitation recorded: the rule-4 check compares the first line of the
`**Description:**` field verbatim; a folded-scalar description split across
continuation lines is compared as its marker only. No information was lost —
the group above is the complete set of first-line duplicates measured.

## The uniform corpus finding (why >25%-defective slices are expected)

1,458 of the 1,460 tracked `registry/skills/*.md` files end with **exactly
one extra trailing blank line** (`...\n\n`); 0 are missing a trailing
newline; 2 files are already single-newline-clean
(`registry/skills/_index.md`, `registry/skills/pre-mortem-row-1452.md`).
This is one uniform upstream/bulk-writer artifact affecting ~99.9% of the
corpus. The in-slice fix authorized by the dispatch brief (whitespace/newline
class) removes exactly one trailing newline byte per file and is byte-exact.
Slices showing ">25% defective files" under the STOP rule are therefore the
expected norm for this corpus; the repair class is mechanical, attributable
and non-judgmental. Any OTHER defect class found in a slice (placeholder,
absolute path, BOM/CR, tab, trailing whitespace, raw-url scheme) is fixed
individually and reported — and any such file that cannot be fixed without
rewriting upstream prose is stopped here instead.

## Per-batch summary

Appended by the t2 batch loop below this line (batch id | defective files |
fixed | stopped | ledger rows). Empty until the loop runs.

## FINAL (2026-11-12, post-reversal) — F-08 re-scope: scan record

Owner ruling 2026-11-12 (verbatim summary): the 2026-11-12 tier-2 trailing-newline
byte sweep was an unauthorized ~89 upstream-card byte edit. The owner ruled REVERT —
executed at `f753461`, which restored the 89 upstream card bytes byte-exact and
reverted the ledger — and F-08 is re-scoped to SCAN-AND-RECORD ONLY: no upstream card
byte edits without a future named ruling. Zero cards were modified by this lane; the
scanner is read-only. This section supersedes the pre-reversal figures above for the
post-reversal tree; those figures are retained as the historical record of their date.

Measured at HEAD `f753461` on 2026-11-12, `git ls-files registry/skills/` = **1,460**
files, all scanned with `node scripts/polish-scan.mjs --registry <files>` in 8 chunks
(7 x 200 + 1 x 60), plus one full-set `--registry-dir` run captured for the
duplicate-description report. Scanner verdicts: every chunk exited 1 (each chunk
carries at least one defective file); `scan_exit` recorded per file is the slice
exit, not a per-file verdict.

Defects found, by class (all 1,449 defect strings across 1,448 files):

- `hygiene`: **1,448** — every one is exactly `must end with exactly one trailing
  newline` (the uniform bulk-writer artifact; files ending with `...\n\n`).
- `absolute-path`: **1** — `registry/skills/brev-etiquette.md:5`,
  `/home/ path "/home/ubuntu"`. This is the recorded STOP above: brev-etiquette.md
  is left byte-identical, the upstream `/home/ubuntu/RL` tokens are upstream truth,
  and no ruling has landed to re-authorize an edit.
- `placeholder`: **0**.
- `raw-url-scheme`: **0**. `empty` / `non-empty-body` / `read`: **0**.
- Files already single-newline-clean (12): `registry/skills/_index.md`,
  `registry/skills/pre-mortem-row-1452.md`, and the 10 pre-sweep `t2-v1`
  final-fix cards (AI-Research-SKILLs, Abuse of Public-Facing API_ Mobile API
  Abuse, Access with Stolen Session Cookie, Account Access Removal,
  Account Manipulation, Account Manipulation_ Account Linking,
  Account Manipulation_ Add Authorized User, Account Manipulation_ Change
  Account Details, Account Manipulation_ Change of Payment Details,
  Account Manipulation_ Enable Account Features), which the revert deliberately
  kept.
- Files ending with the double trailing newline: **1,448** (superseding the
  "1,458 / 2 single-newline-clean" pre-reversal figure: the +10 difference is exactly
  the 10 kept final-fix cards).

duplicate-**Description:** reports (report-only, never defects, upstream truth —
not edited): **72 cards**, one clique, all carrying the verbatim first-line value
`>-` (empty YAML folded-scalar marker), resolving to
`mukul975/Anthropic-Cybersecurity-Skills`. The clique is byte-for-byte the same
set as the 72 cards recorded in the "Duplicate verbatim **Description:** group"
section above (verified set-equal against the full-set scanner output); no
additional duplicate groups were measured. The full-set scanner printed one
`duplicate-description (report, not a defect)` line per card (72 lines); the pairs
are not pasted here because the 72-card list above is the same set, verbatim.

brev-etiquette.md STOP (recorded above, still in force): unchanged, carried into the
scan ledger as `t2-scan-v1` with its 2 measured defects
(`hygiene: must end with exactly one trailing newline`,
`absolute-path:5: /home/ path "/home/ubuntu"`).

Ledger record: exactly **1,460** rows appended to `registry/polish-ledger.jsonl`,
tier 2, `standard_version: "t2-scan-v1"`, `polished_by:
"vantrilex-implementer/scan-record/final-fix"`, `polished_at: "2026-11-12"`,
`scan_exit` (slice exit; 1 for every slice), `defects` as scanned (`[]` for the
12 clean files), `sha256` of the current bytes, one row per tracked file. **Zero
existing ledger rows were edited or removed.** The 10 pre-sweep `t2-v1` final-fix
rows and the 12 clean ids each also carry a `t2-scan-v1` row (two rows per id for
those ids, by design of the scan record). **Zero card bytes were changed to produce
this record.**
