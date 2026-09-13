import json
import os
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator

app = FastAPI(title="ProfileProof Self-Audit API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
fixtures = json.loads((Path(__file__).resolve().parent.parent / "data/posts.json").read_text())

RULES = [
    {"terms": ["idiot", "stupid", "lose it"], "category": "Hostility", "points": 62, "action": "Review context or archive"},
    {"terms": ["hungover", "drunk", "drugs"], "category": "Substance reference", "points": 34, "action": "Review audience and context"},
    {"terms": ["badge", "access card", "patient"], "category": "Workplace privacy", "points": 28, "action": "Check for identifying details"},
    {"terms": ["hate", "should be fired"], "category": "Aggressive language", "points": 22, "action": "Add context or archive"},
]


class Post(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    id: str = Field(min_length=1, max_length=80)
    platform: Literal["X", "Instagram", "Facebook", "LinkedIn"]
    postedAt: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    text: str = Field(min_length=12, max_length=1000)
    visibility: Literal["public", "friends", "private"]
    engagement: int = Field(ge=0, le=10_000_000)

    @field_validator("text")
    @classmethod
    def reject_blank_text(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("blank_post_text")
        return value


class AuditRequest(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    profession: Literal["nursing", "finance", "general"]
    posts: list[Post] = Field(min_length=1, max_length=100)


def assess(post: Post, profession: str) -> dict:
    text = post.text.lower()
    hits = [rule for rule in RULES if any(term in text for term in rule["terms"])]
    profession_boost = 18 if profession == "nursing" and any(hit["category"] == "Workplace privacy" for hit in hits) else 0
    profession_boost += 8 if profession == "finance" and any(hit["category"] == "Substance reference" for hit in hits) else 0
    score = min(100, sum(int(hit["points"]) for hit in hits) + profession_boost + (8 if post.visibility == "public" else 0))
    severity = "high" if score >= 60 else ("medium" if score >= 28 else "low")
    return {
        **post.model_dump(), "score": score, "severity": severity,
        "category": hits[0]["category"] if hits else "No flagged pattern",
        "recommendation": hits[0]["action"] if hits else "Leave as-is",
        "reasons": [f'{hit["category"]} phrase match' for hit in hits] or ["No demo rule matched"],
    }


@app.get("/health")
def health():
    return {"status": "ok", "mode": "demo", "source": "fictional_fixture"}


@app.get("/posts")
def list_posts():
    return fixtures


@app.post("/audits")
def create_audit(request: AuditRequest):
    findings = sorted((assess(post, request.profession) for post in request.posts), key=lambda item: item["score"], reverse=True)
    return {
        "profession": request.profession,
        "summary": {"total": len(findings), "high": sum(item["severity"] == "high" for item in findings), "review": sum(item["severity"] != "low" for item in findings)},
        "findings": findings,
        "disclaimer": "Deterministic fictional demo; not hiring, legal, or reputation advice.",
    }
