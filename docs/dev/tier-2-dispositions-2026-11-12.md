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
