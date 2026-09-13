# Architecture

```text
candidate export -> consent + malware scan -> normalize -> versioned rules
       |                    |                   |             |
  no credentials      quarantine/error      encrypted TTL   explanation
                                                                |
                                                         human review
                                                                |
                                                     candidate decision log
                                                                |
                                                        delete raw archive
```

## Prototype

The static Next.js app reads `data/posts.json`, performs an explainable deterministic assessment, and stores review state only in React memory. FastAPI exposes `GET /health`, `GET /posts`, and `POST /audits` against the same fixture contract. GitHub Pages hosts only the frontend; Python is locally runnable and CI-tested source.

## Production boundaries and observability

Use direct-to-object-store uploads, per-user encryption, short TTLs, job idempotency, a relational metadata store, isolated workers, immutable consent/audit records, and explicit deletion receipts. Name failures: `archive_malware` quarantines; `unsupported_export` stops with guidance; `parse_partial` shows omitted counts; `rule_timeout` retries then abstains; `review_disagreement` escalates; `delete_failed` pages operations and blocks completion. Track import success, omitted records, finding precision, reviewer agreement, user overrides, time-to-report, deletion SLA, support complaints, anxiety delta, and category distribution. Alert on deletion failure, cross-user access, sudden finding-rate drift, or reviewer disagreement above threshold.
