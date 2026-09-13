# CEO Review

**Mode:** Scope reduction. A broad AI scanner risks selling anxiety; the accepted scope is candidate-controlled, transparent, and human-reviewed.

## Nuclear challenge

The outcome is a bounded context checklist before an active nursing application, not a universal reputation score. Alternatives were a rules checklist, human-reviewed preflight, and portable context vault. The middle path earns a $49 test while producing labels. Twelve-month ideal: a trusted candidate rights/context layer with deletion proof and bias evidence.

## 1. Architecture
Separate consent, raw import, normalization, rule version, review, decision, and deletion. Never pass platform credentials through the system. Raw content and metadata have different retention boundaries.

## 2. Error and rescue map
`archive_malware` → quarantine; `unsupported_export` → stop with adapter guidance; `parse_partial` → visible omission count; `rule_timeout` → retry then abstain; `review_disagreement` → second reviewer; `delete_failed` → block completion and page operations. No silent success.

## 3. Security and threat model
Exports contain intimate data and third-party content. Encrypt per user, minimize collection, scan archives, prevent path traversal/decompression bombs, redact logs, use scoped reviewer access, audit every view/export, and provide verified TTL deletion. Prompt injection in posts is untrusted data.

## 4. Data and interaction edges
Nil and empty imports stop before payment; corrupt and partial files disclose exact omissions; duplicates deduplicate by platform/content hash. Double submission is idempotent. Navigate-away retains upload state without duplicating jobs. Stale review edits conflict. Slow deletion remains visibly pending.

## 5. Code quality
One versioned scoring contract must drive preview, API, and evaluation. The prototype duplicates deterministic rules for static hosting; parity tests become mandatory before production. Avoid category sprawl and euphemistic names.

## 6. Tests
Cover archive attacks, unsupported versions, partial parse, multilingual/emoji text, duplicates, profession weighting, clean content, appeal, reviewer conflict, TTL deletion, access isolation, mobile overflow, and keyboard focus. Prototype tests cover happy, invalid, clean, profession-change, filter, review, and mobile paths.

## 7. Observability
Measure import completeness, precision, disagreement, override, appeal, drift, harmful false alarm, time-to-report, deletion SLA, user anxiety delta, conversion, refund, and repeat intent. Metrics must be segmented without inferring protected traits.

## 8. Database and state
Unique import idempotency keys, immutable rule/review versions, append-only decisions, consent history, deletion tombstones, and no raw text in analytics. Index user/status/expiry; enforce tenant ownership in every query.

## 9. API contract
Version import adapters separately from normalized posts. Use strict schemas, bounded batches, signed upload grants, explicit problem codes, rate limits, and stable abstention semantics. Never expose an endpoint that employers can use to score candidates.

## 10. Performance
Correctness dominates at pilot scale. At 10x, stream archives and batch rule evaluation. At 100x, isolate import workers and reviewer queues while preserving per-user ordering. Cap archive size and decompressed expansion.

## 11. Design and UX
Show consent and limitations before risk counts. Explanation precedes action. Color never carries severity alone. Empty/loading/error/partial/deletion states remain explicit. On mobile, filters scroll but content does not overflow. Never nudge deletion.

## Decisions

- **Accepted:** nursing wedge, user-supplied fictional/demo data now, transparent rules, human context review, reversible user decisions.
- **Deferred:** live imports, model classification, reviewer marketplace, payments, monitoring.
- **Not in scope:** employer portal, employability score, automatic deletion, protected-trait inference, credential collection.
- **Strongest challenges:** unproven willingness to pay, false-positive harm, sensitive-data security.
- **Status:** DONE_WITH_CONCERNS until paid observation and harm metrics validate the wedge.
