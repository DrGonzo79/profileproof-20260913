"use client";

import { useMemo, useState } from "react";
import fixturePosts from "@/data/posts.json";

type Profession = "nursing" | "finance" | "general";
type Severity = "high" | "medium" | "low";
type Filter = "all" | Severity;
type Post = typeof fixturePosts[number];
type Finding = Post & { score: number; severity: Severity; category: string; recommendation: string; reasons: string[] };

const rules = [
  { terms: ["idiot", "stupid", "lose it"], category: "Hostility", points: 62, action: "Review context or archive" },
  { terms: ["hungover", "drunk", "drugs"], category: "Substance reference", points: 34, action: "Review audience and context" },
  { terms: ["badge", "access card", "patient"], category: "Workplace privacy", points: 28, action: "Check for identifying details" },
  { terms: ["hate", "should be fired"], category: "Aggressive language", points: 22, action: "Add context or archive" },
];

function assess(post: Post, profession: Profession): Finding {
  const text = post.text.toLowerCase();
  const hits = rules.filter(rule => rule.terms.some(term => text.includes(term)));
  const professionBoost = profession === "nursing" && hits.some(hit => hit.category === "Workplace privacy") ? 18 : profession === "finance" && hits.some(hit => hit.category === "Substance reference") ? 8 : 0;
  const publicBoost = post.visibility === "public" ? 8 : 0;
  const score = Math.min(100, hits.reduce((sum, hit) => sum + hit.points, 0) + professionBoost + publicBoost);
  const severity: Severity = score >= 60 ? "high" : score >= 28 ? "medium" : "low";
  return { ...post, score, severity, category: hits[0]?.category ?? "No flagged pattern", recommendation: hits[0]?.action ?? "Leave as-is", reasons: hits.length ? hits.map(hit => `${hit.category} phrase match`) : ["No demo rule matched"] };
}

const pretty = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(fixturePosts);
  const [profession, setProfession] = useState<Profession>("nursing");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(fixturePosts[0].id);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [platform, setPlatform] = useState("X");

  const findings = useMemo(() => posts.map(post => assess(post, profession)).sort((a, b) => b.score - a.score), [posts, profession]);
  const visible = findings.filter(item => filter === "all" || item.severity === filter);
  const selected = findings.find(item => item.id === selectedId);
  const counts = { high: findings.filter(f => f.severity === "high").length, medium: findings.filter(f => f.severity === "medium").length, low: findings.filter(f => f.severity === "low").length };

  async function runScan() {
    setError(""); setLoading(true); setScanned(false);
    await new Promise(resolve => setTimeout(resolve, 550));
    if (!posts.length) setError("Add at least one demo post before scanning."); else setScanned(true);
    setLoading(false);
  }

  function addPost(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (draft.trim().length < 12) return setError("Post text must contain at least 12 characters.");
    if (draft.length > 1000) return setError("Post text must be 1,000 characters or fewer.");
    const post: Post = { id: `custom-${posts.length + 1}`, platform, postedAt: "2026-09-13", text: draft.trim(), visibility: "public", engagement: 0 };
    setPosts(current => [post, ...current]); setSelectedId(post.id); setDraft(""); setScanned(true); setFilter("all");
  }

  return <div className="shell">
    <a className="skip" href="#audit">Skip to audit workspace</a>
    <header className="topbar"><a className="brand" href="#top"><span>PP</span>ProfileProof</a><nav aria-label="Primary"><a href="#audit">Audit</a><a href="#method">Method</a></nav><div className="demo"><i /> FICTIONAL POSTS · SIMULATED SCREEN</div></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow">CAREER REPUTATION PRE-FLIGHT</div><h1>See the posts a recruiter <em>might question.</em></h1><p>Run a private, explainable self-audit before you apply. Review context, choose what to change, and keep the human decision yours.</p><div className="hero-actions"><button onClick={() => void runScan()} disabled={loading}>{loading ? "Screening demo posts…" : "Run private demo scan"}<span>→</span></button><a href="#method">How scoring works</a></div></div><aside><small>DEMO READINESS</small><strong>{100 - Math.round(findings.reduce((sum, item) => sum + item.score, 0) / Math.max(1, findings.length))}</strong><span>profile confidence score</span><div><p><b>{counts.high}</b> high review</p><p><b>{reviewed.length}</b> decisions logged</p></div></aside></section>
      <section id="method" className="method"><div><span>01</span><p><strong>Collect with consent</strong>Only accounts and text the job seeker chooses to review.</p></div><div><span>02</span><p><strong>Explain every flag</strong>Transparent phrase rules in this demo, not hidden employer judgments.</p></div><div><span>03</span><p><strong>Keep agency</strong>Review, contextualize, archive, or leave content unchanged.</p></div></section>
      <section className="workspace" id="audit"><div className="section-head"><div><small>SELF-AUDIT 01</small><h2>Candidate review desk</h2></div><p>Decision-support prototype only. It does not connect to social accounts, identify people, contact employers, or predict hiring outcomes.</p></div>
        <div className="notice">All identities, posts, scores, and outcomes are fictional. “AI” behavior is simulated with deterministic keyword rules.</div>
        {scanned && <div className="success" role="status">Scan complete: {findings.length} posts checked; {counts.high + counts.medium} deserve a human context review.</div>}
        {error && <div className="error" role="alert">{error}</div>}
        <div className="controls"><label>Target role<select aria-label="Target profession" value={profession} onChange={event => setProfession(event.target.value as Profession)}><option value="nursing">Nursing</option><option value="finance">Financial services</option><option value="general">General professional</option></select></label><div className="tabs" role="group" aria-label="Severity filter">{(["all","high","medium","low"] as Filter[]).map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{pretty(value)}<span>{value === "all" ? findings.length : counts[value]}</span></button>)}</div></div>
        <form className="composer" onSubmit={addPost}><label>Try your own fictional example<textarea aria-label="Demo post text" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Paste fictional post text to test the transparent demo rules…" /></label><label>Platform<select aria-label="Demo platform" value={platform} onChange={event => setPlatform(event.target.value)}><option>X</option><option>Instagram</option><option>Facebook</option><option>LinkedIn</option></select></label><button type="submit">Add & assess →</button></form>
        <div className="workgrid"><section className="results" aria-label="Audit findings"><div className="result-head"><span>RISK</span><span>POST / REASON</span><span>STATUS</span></div>{visible.length ? visible.map(item => <button key={item.id} className={`result-row ${selectedId === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id}><span className={`score ${item.severity}`}>{item.score}</span><span className="post-copy"><strong>{item.platform}<i>{item.category}</i></strong><small>{item.postedAt} · {item.visibility}</small><em>“{item.text}”</em></span><span className="status">{reviewed.includes(item.id) ? "Reviewed" : pretty(item.severity)}</span></button>) : <div className="empty"><strong>No findings in this view</strong><p>Change the severity filter to review other demo posts.</p></div>}</section>
          <aside className="detail" aria-live="polite">{selected ? <><div className="detail-head"><div><small>CONTEXT REVIEW</small><h3>{selected.platform} · {selected.postedAt}</h3></div><span className={`score ${selected.severity}`}>{selected.score}</span></div><blockquote>“{selected.text}”</blockquote><dl><div><dt>Visibility</dt><dd>{pretty(selected.visibility)}</dd></div><div><dt>Audience signal</dt><dd>{selected.engagement} demo reactions</dd></div><div><dt>Target lens</dt><dd>{pretty(profession)}</dd></div><div><dt>Severity</dt><dd>{pretty(selected.severity)}</dd></div></dl><div className="signals"><small>WHY IT FLAGGED</small>{selected.reasons.map(reason => <span key={reason}>↳ {reason}</span>)}</div><div className="recommend"><small>SUGGESTED REVIEW</small><strong>{selected.recommendation}</strong><p>Read the full context before changing anything. A phrase match is not misconduct and this score is not a hiring prediction.</p></div><button className="review" onClick={() => setReviewed(current => current.includes(selected.id) ? current.filter(id => id !== selected.id) : [...current, selected.id])}>{reviewed.includes(selected.id) ? "Undo review decision" : "Mark context reviewed"}</button></> : <div className="empty"><strong>Select a post</strong><p>Choose a finding to inspect the simulated rationale.</p></div>}</aside>
        </div>
      </section>
    </main>
    <footer><a className="brand" href="#top"><span>PP</span>ProfileProof</a><p>Candidate-controlled self-audit. Never automate deletion; never present a score as fact.</p><a href="https://github.com/DrGonzo79/profileproof-20260913">Source & product notes →</a></footer>
  </div>;
}
