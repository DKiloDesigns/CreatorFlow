# 🛠️ BizAssist Development Workflow

This workflow incorporates best practices from Den sessions to keep your codebase stable, maintainable, and easy to review. Use this checklist for every major change, feature, or bugfix.

---

## 1. Impact Analysis (Den Session Standard)

- **Describe the intended change** (feature, refactor, bugfix, etc.).
- **List all files, modules, and systems likely to be affected** (use code search if needed).
- **Check for implicit dependencies** (shared code, config, env vars, etc.).
- **Summarize potential risks** (data loss, breaking changes, UI/UX impact).
- **Document the analysis** in the PR, issue, or a `/docs/problem_reports/` entry.

---

## 2. Batch Related Requests

- **Group related changes** (e.g., all UI tweaks, all auth fixes) into a single PR or session.
- **Analyze the combined impact** (see above).
- **Communicate the batch scope** clearly in the PR/commit message.

---

## 3. Stabilization & Regression Testing

- **After major changes, run all relevant tests** (unit, integration, E2E).
- **If tests are missing, add at least a basic one for new/changed logic**.
- **Do a quick manual smoke test** of affected features.
- **Log any regressions or weirdness** in `/docs/problem_reports/`.

---

## 4. Explicit File Moves/Deletions

- **When moving or deleting files, always document the action** in the PR/commit.
- **If deleting, double-check for references** (imports, links, docs).
- **Update any related docs or READMEs**.

---

## 5. Documentation & Communication

- **Summarize what changed, why, and any risks** in the PR/commit.
- **Update `/docs/_ai_journals/` and `/docs/problem_reports/` as needed**.
- **If user feedback or Den session triggers a change, reference it in the docs/commits**.

---

## Quick Checklist (for every major change)

- [ ] Impact analysis written and attached
- [ ] Related requests batched (if possible)
- [ ] All tests run (and new ones added if needed)
- [ ] File moves/deletions documented
- [ ] Docs and journals updated

---

**Reference this doc in PRs, issues, and team discussions:**

- `See [DEV_WORKFLOW.md](docs/DEV_WORKFLOW.md) for the full checklist and process.`
- For specific steps, link to the relevant section using anchors (e.g., `#impact-analysis-den-session-standard`).
