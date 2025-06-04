# AI Post Office (AIPO) - Quick Reference (Dedicated Repo)

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

**Summary:**
AIPO is a Git-based system hosted in its own repository (`https://github.com/oliksueddaht/aipo-core`). For details, see the SHC chunk: `_shc_refactor_v0.1/chunks/si_core_aipo.md`.

**To Initialize:**
Clone the dedicated repo: `git clone https://github.com/oliksueddaht/aipo-core.git`

**Trigger:**
Mentioning "AIPO" or "post office" will surface this chunk and diagram for instant recall.

---

## Mailbox Processing Workflow (Standard)

Agents **SHOULD** follow this standard workflow for processing messages received in their designated inbox directory (e.g., `aipo/inbox/<agent_uuid>/`):

1.  **Check Inbox:** During bootstrap or periodically, check the main inbox directory for new message files (typically JSON).
2.  **Process Message:** Read and act upon the contents of each new message according to the AIPO protocol.
3.  **Archive Message:** After successful processing, move the message file into an `_archive` subdirectory within the agent's inbox (e.g., `aipo/inbox/<agent_uuid>/_archive/`). This keeps the main inbox clear while preserving message history.

_(Note: This workflow ensures the main inbox reflects only unprocessed messages.)_
