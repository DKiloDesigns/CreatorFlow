---
id: si_core_aipo
version: 1.1.0
status: Active
intent: Provide a unified, instantly accessible reference for the AIPO (AI Post Office) system hosted in its dedicated repository.
why:
  [
    AgentSync,
    CoreUpdates,
    Communication,
    ContextRecall,
    UserOnboarding,
    Security,
    SeparationOfConcerns,
  ]
scope: [Agent, Bootstrap, User]
trigger_keywords: [AIPO, ai post office, post office, core update, agent sync]
waymarkers:
  - protocol: AIPO_PROTOCOL.md
  - feedback: feedback/
  - repo: https://github.com/oliksueddaht/aipo-core
  - history:
      - docs/project_summaries/session_summary_20250417_112436.md
      - docs/_ai_kra/KRA-20250427-BaeLloydDFAIMigrationChecklist.md
      - docs/case_studies/agent_sync_alignment_v1.md
---

# AIPO (AI Post Office) - Core Reference (Dedicated Repo)

**Definition:**
AIPO is a Git-based, agent-to-agent communication and core update system for DFAI, hosted in its own dedicated repository (`https://github.com/oliksueddaht/aipo-core`). It enables asynchronous messaging, shared core updates, and instant context recall for all agents and users, ensuring secure and focused access to core components.

**How it works:**

- The AIPO core (SHC chunks, protocols, communication structure) lives in its own repository.
- Core updates are pushed directly to the dedicated `aipo-core` repo.
- Agents send/receive JSON messages via the `inbox/` subfolders within their clone of the `aipo-core` repo.
- At session start, agents check the AIPO inbox (within their `aipo-core` clone) for new messages or core updates by pulling from the remote `aipo-core` repo.
- New projects/users initialize by simply cloning the dedicated `aipo-core` repository.

**Workflow Diagram:**

```
┌──────────────────────────────┐
│  DFAI Core Maintainer/Agent  │
├──────────────────────────────┤
│ 1. Update SHC, Protocols,    │
│    or AIPO core files        │
│ 2. Commit & push to:         │
│    github.com/oliksueddaht/  │
│    aipo-core                 │
└─────────────┬────────────────┘
              │
              │ (core_update_notice message)
              │
┌─────────────▼────────────────┐
│   Dedicated AIPO Core Repo   │
│ (github.com/oliksueddaht/    │
│         aipo-core)           │
└─────────────┬────────────────┘
              │
              │ (User/Agent clones or pulls)
              │
┌─────────────▼────────────────┐
│   New Project/User/Agent     │
├──────────────────────────────┤
│ 1. Clones the dedicated      │
│    `aipo-core` repo into     │
│    their project             │
│ 2. For ongoing updates:      │
│    - Pulls latest from       │
│      `aipo-core` repo        │
│    - Watches for AIPO        │
│      inbox messages          │
└──────────────────────────────┘
```

**Quick Reference:**

- Repository: `https://github.com/oliksueddaht/aipo-core`
- Protocol: `AIPO_PROTOCOL.md` (in repo root)
- Feedback: `feedback/` (in repo root)
- Relevant History (External): `docs/project_summaries/session_summary_20250417_112436.md`

**Trigger:**
Mentioning "AIPO" or "post office" will surface this chunk and diagram for instant recall.
