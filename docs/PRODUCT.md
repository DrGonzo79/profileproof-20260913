# Product plan

## ICP and JTBD

**ICP:** US nurses changing hospitals or staffing agencies, with multi-year public social histories and an application underway. **JTBD:** “Before credentialing and interviews, help me find public posts that deserve context review so I can decide what to do without surrendering my accounts or identity.”

## MVP and data model

The paid wedge is a one-time, consented export review: ingest selected archives, normalize posts, run explainable rules, rank at most ten items, human-verify them, then let the candidate log `keep`, `contextualize`, `privacy-change`, or `archive` decisions. Prototype fixtures demonstrate `Post`, `Finding`, and `ReviewDecision`; production adds `User`, `ConsentReceipt`, `ImportJob`, `RuleVersion`, and immutable `AuditEvent` records.

## Architecture and AI/model strategy

Browser uploads go directly to an encrypted processing boundary; workers normalize content, apply versioned policies, and send uncertain findings to human review. Raw exports expire quickly. Begin with deterministic taxonomies and evaluation sets. Later, use a constrained model only to classify context with structured output, calibrated confidence, prompt/model versions, counterfactual bias tests, and abstention. User content is data, never instruction. No automated deletion or employability score.

## Economics and offer ladder

Test the source’s **$49 report** as the first transaction; target under 20 minutes of human review and payment/processing costs under $8, yielding roughly 60% contribution margin during concierge validation. A plausible ladder is $49 one-time preflight, then $79 annual rescan; do not launch subscriptions until users request repeated monitoring. Paid acquisition cannot work if blended CAC exceeds roughly $20 at the one-time price, so initial GTM must be partnerships and high-intent search.

## Validation and GTM

Partner with two nurse career coaches and one staffing recruiter who serves candidates, not employers. Run 25 concierge audits. Gates: ≥20% landing-to-paid among active applicants, ≥70% of surfaced items judged worth reviewing, <15% harmful false alarms, median completion under 24 hours, and ≥30% requesting a later rescan. Measure anxiety before/after. Stop if user well-being worsens or reviewers cannot agree on category labels.

## Moat

Not keyword scanning. Potential moat: consented candidate-side archives, labeled context/decision outcomes, profession-specific evaluation rubrics, reviewer quality data, privacy-preserving import adapters, and trusted distribution through career services. Candidate trust and defensible bias audits matter more than model novelty.

## Risks

Bias amplification; false accusation; sensitive-category inference; third-party privacy; platform terms; account credential collection; data breach; over-retention; model hallucination; reviewer inconsistency; coercive employer use; defamation; mental-health impact; and regulation covering employment decision tools. Mitigate with self-use-only terms, no employer portal, minimum collection, encryption, TTL deletion, explanations, appeals, quality sampling, disparate-impact testing, and counsel before live launch.

## 30/60/90

- **30 days:** observed self-searches, paid concierge report, taxonomy, harm rubric, consent copy, deletion proof.
- **60 days:** secure export upload for two platforms, reviewer console, decision log, evaluation dashboard, partner pilot.
- **90 days:** additional export adapter, annual rescan experiment, bias audit, candidate correction/context packet, pricing decision.
