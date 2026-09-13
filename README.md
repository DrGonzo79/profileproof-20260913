# ProfileProof

A runnable candidate-controlled social-media self-audit prototype. It evaluates fictional posts with transparent deterministic rules, ranks context-review items, changes the lens by target profession, accepts a fictional custom post, and records local review decisions.

**Live frontend:** https://drgonzo79.github.io/profileproof-20260913/

> Demo only: all posts, identities, scores, and outcomes are fictional. No social account, AI model, employer, deletion, payment, or hiring prediction is connected. The FastAPI backend is runnable/tested source and is not publicly hosted.

## Run and verify

```bash
npm ci
npm run dev
```

```bash
cd api
uv sync --frozen
uv run uvicorn main:app --reload
```

```bash
npm run typecheck
cd api && uv run pytest -q
cd .. && npm run test:e2e
NEXT_PUBLIC_BASE_PATH=/profileproof-20260913 npm run build
npm audit --audit-level=high
```

GitHub Actions repeats locked installs, type checking, Python and browser tests, and the repo-base-path-aware static build before deploying `out/` to Pages. See [source notes](research/notes.md), [product plan](docs/PRODUCT.md), [architecture](docs/ARCHITECTURE.md), [Office Hours](docs/OFFICE_HOURS.md), [CEO Review](docs/CEO_REVIEW.md), and [build prompts](docs/BUILD_PROMPTS.md).
