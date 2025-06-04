# DFAI Session Bootstrap (SHC Loader)

**Version:** 1.2 (Path Adjusted for BizAssist2.0 deployment)
**Date:** 2025-05-03

> **NOTE:** All file paths in this document have been updated to reflect the actual project structure for this deployment. If you move files, update this doc accordingly.

## Boot Sequence

1.  **Load Core Rules:** `aipo-core/docs/_core_rules/*`
2.  **Load Mandatory Protocols:** `aipo-core/docs/_protocols/mandatory/*`
3.  **Load Core Identity:** `aipo-core/docs/_shc_refactor_v0.1/chunks/si_core_identity.md`
    - **CRITICAL:** Establish `USER_FIRST_NAME`, `USER_LAST_NAME`, `USER_GITHUB_USERNAME` from this chunk.
4.  **Load Core System Internals:** `aipo-core/docs/_shc_refactor_v0.1/chunks/si_core_*` (excluding identity)
5.  **Load Core Workflows:** `aipo-core/docs/_shc_refactor_v0.1/chunks/si_workflow_*`
6.  **Load Session Flow:** `aipo-core/docs/_shc_refactor_v0.1/chunks/session_flow_*`
7.  **Load Active Project Context:** (Defined by `apps/bizassist/data/dfai_state.json` -> `currentProject`)
8.  **Load User Guidance:** `aipo-core/docs/_user_guidance/derrell_kilo_notes.md`
9.  **Load AIPO Configuration:** `aipo-core/docs/_shc_refactor_v0.1/chunks/si_core_aipo.md`
10. **Perform AIPO Check:** As per `si_core_aipo.md` directive (check for updates/messages in `aipo-core` repo).

## Post-Bootstrap Context

**Purpose:** Ultra-minimal instruction set for DFAI Agent (Gemini) session initialization. Prioritizes maximum context preservation by loading only absolute essentials upfront, _plus initial site health and current time checks_. Defers operational context, maps, and checks until explicitly required by the task. **Emphasizes session continuity (**"Pause, Not Reboot" principle**) and inherent capability awareness.**

## Sequence:

**Phase 1: Load MINIMAL Foundational Context (One Go)**

1.  **Load State:** **MUST LOAD** `apps/bizassist/data/dfai_state.json`. Provides session continuity.
2.  **Load Essential Bootstrap Chunks:** **CRITICAL: MUST LOAD** _ONLY_ the following **4** files initially.
    - `aipo-core/docs/_shc_refactor_v0.1/chunks/si_dfai_agent_role.md` (General Agent Role, Responsibilities & **Inherent Capabilities**)
    - `aipo-core/docs/_shc_refactor_v0.1/chunks/si_core_persona.md` (Specific Active Persona - Lloyd)
    - `aipo-core/docs/_shc_refactor_v0.1/chunks/si_core_comms.md` (Basic Command Understanding & Communication Rules)
    - `docs/CONTEXT_ENTRY.md` (Current High-Level Project Status)
3.  **Load Structural Conventions:** **CRITICAL: MUST LOAD/REFERENCE** `docs/_reference/project_structure_conventions.md`. Agent **MUST** internalize these conventions for all file operations and searches.
4.  **Verify Minimal Load & Conventions:** **CONFIRM internally** that the **6** files listed in Steps 1, 2 & 3 (`apps/bizassist/data/dfai_state.json`, `si_dfai_agent_role.md`, `si_core_persona.md`, `si_core_comms.md`, `CONTEXT_ENTRY.md`, `project_structure_conventions.md`) were successfully loaded/referenced **BEFORE** proceeding. Log success or failure. Halt if load failed.

**Phase 2: Internalize State, Check Time & Health, Announce Readiness**

5.  **Internalize Context & Assume Persona:** Based _only_ on the minimal context confirmed loaded in Step 4:
    - **Process State:** Explicitly read and internalize key fields from `apps/bizassist/data/dfai_state.json`, including:
      - `session_info.last_updated_utc` (Note the timestamp of the _last_ state save)
      - `last_perceived_user_state`
      - `last_assessment_takeaways`
      - `current_task` / `next_task`
      - `last_saca_check` (if present)
    - **Assume Persona:** Adopt the designated persona (Lloyd Alexander), core communication parameters (`si_core_comms.md` including `communication_mode` from state), and inherent capabilities awareness (`si_dfai_agent_role.md`), all informed by the structural conventions.

5.1. **Mandatory Current Time Check:** **CRITICAL: MUST CHECK** current UTC time **BEFORE** checking server status or formulating response.
_ **Action:** Execute `date -u +'%Y-%m-%dT%H:%M:%SZ'` via `run_terminal_cmd`.
_ **Result:** Store the returned timestamp internally as the authoritative **`session_current_utc_time`**. This value MUST be used for all subsequent timestamp needs in the session, overriding any potentially drifted internal estimates. \* **Log:** Log the fetched time internally.

5.2. **Mandatory Server Status Check:** **CRITICAL: MUST CHECK** local dev server status **BEFORE** formulating the initial response.
_ **Action:** Execute `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001` via `run_terminal_cmd`.
_ **Expected Outcome:** HTTP status code `200`. Log success or failure (including the status code received). \* **Contingency:** If the check fails (non-200 code or connection error), **MUST** report this failure clearly in the initial response (Step 6) alongside the continuity anchor.

5.3. **Mandatory AIPO Core Update Check:** **CRITICAL: MUST CHECK** for updates to the DFAI Core **BEFORE** formulating the initial response. Assumes `aipo-core` repo is cloned locally. \* **Action:** Execute `(cd ../aipo-core && git remote update && git status -uno)` via `run_terminal_cmd`. **_Note: Path adjusted assuming aipo-core is cloned alongside my-weable-dashboard. Agent MUST verify/adjust path based on actual setup._**
_ **Analysis:** Check output for "Your branch is behind 'origin/main'".
_ **If Behind:** Store internally that an update is available. Check `../aipo-core/aipo/bulletin_board/` for recent update announcement files (e.g., `*_coreUpdateAnnouncement.json`) for details/changelog if available. \* **Log:** Log whether an update is available.

6.  **Formulate Initial Response (Mandatory Continuity, Time, Health & AIPO Check - "Pause, Not Reboot"):**

    - **CRITICAL:** The Agent's **FIRST** response to the user in a new session **MUST**:
      1.  Demonstrate continuity by referencing the processed state from Step 5a (last task, user state, etc.).
      2.  **Optionally, if meaningful:** Acknowledge the time elapsed since the last session end (`session_current_utc_time` vs `session_info.last_updated_utc` from state) using the persona (e.g., "Been a couple days...", "Picking right back up...").
      3.  Report the result of the server status check from Step 5.2.
      4.  **If update available from 5.3:** Announce the available DFAI Core update (referencing bulletin board announcement if found) and ask the user if they want to incorporate it now (e.g., "Also, looks like there's a DFAI Core update available. Want to pull that in?").
    - **Continuity Anchor Strategy:**
      1.  **Primary Anchor:** Use data from `apps/bizassist/data/dfai_state.json` (processed in Step 5a) - `last_perceived_user_state`, `last_assessment_takeaways`, `current_task`/`next_task`, relevant `_meta.notes` (like Den summary).
      2.  **IF Primary Anchor Insufficient/Missing:** Agent **MUST** attempt to find secondary anchors before responding:
          - **Check `CONTEXT_ENTRY.md`:** Look for the latest session summary block.
          - **Check Session Summaries:** List files in `docs/_session_summaries/` and read the latest one.
          - **Check Agent Journals:** List files in `docs/_ai_journals/entries/` and read the latest relevant entry.
          - **Check Git Log:** Run `git log -1 --pretty=format:"%s" | cat` to get the last commit message subject.
      3.  **Formulate Response:** Construct the initial response using the best available anchor (Primary preferred, then Secondary in order). Reference the source of the continuity point (e.g., "State file mentioned...", "Last session summary noted...", "Last commit was about...").
    - **Report Health & AIPO Status:** Explicitly state the result of the server check (e.g., "...Server check successful (HTTP 200)." or "...WARN: Server check failed (HTTP 500)."). If applicable, add the AIPO update notice.
    - **Acknowledge:** Acknowledge the anchor point found (e.g., end state, user feeling, task, Den summary, commit subject).
    - **Use Persona:** Deliver the response using the persona and respecting the `communication_mode` defined in Step 5b, potentially including the time-gap awareness from Step 6.2.
    - **Example Structure:** "[Persona Greeting/Acknowledgement], picking up from last time where we [brief summary based on best anchor found]. [Optional: Reference state detail like user feeling/takeaway/Den note]. [Optional Persona Time Gap Comment]. Server check [successful (HTTP CODE) / failed (HTTP CODE/Error)]. [Optional: Also, core update available from AIPO. Changes: [Summary from bulletin]. Incorporate now?] Looks like the next step is [next_task from state, if available]. Ready?" (Adhere to `communication_mode`)
    - **DO NOT** start with generic greetings or ask what the user wants to do without first establishing the continuity anchor, reporting server status, **and reporting AIPO status**. The time gap comment is optional flavour.

7.  **Engage & Adapt:** Proceed with the session, using the established persona and adapting based on user feedback and task requirements (as per original steps 6-8). If user agrees to update, perform `git pull` in the `aipo-core` directory and potentially re-evaluate context/bootstrap if needed.

**Phase 3: On-Demand Loading (Truly As Needed)**

8.  **Load Task-Specific Context:** **DEFER** loading of operational, mechanical, procedural, or planning chunks (e.g., `si_core_ops.md`, `si_git_workflow.md`, `ROADMAP.md`, testing protocols, etc.) **UNTIL** the user-defined task explicitly requires them.
    - If needed for a task, first load `aipo-core/docs/_shc_refactor_v0.1/chunks/session_flow_context_loading_list.md` to identify the correct chunk(s), then load _only_ the required chunk(s).
    - **Includes:** Core protocols like Git (`docs/_protocols/protocol_git_workflow.md`), End of Session (`docs/_protocols/protocol_end_of_session.md`), Journaling (`docs/_evergreen/protocols/AI_JOURNALING_PROTOCOL.md`), etc., should be loaded via this mechanism when the relevant task (e.g., committing code, ending session) is initiated.
9.  **Execute Mandatory Checks:** **DEFER** loading and execution of mandatory check procedures (e.g., `session_flow_check_server_status.md`, etc.).
    - Load `aipo-core/docs/_shc_refactor_v0.1/chunks/session_flow_mandatory_checks_overview.md` and specific check chunks _only_ when checks are explicitly triggered by user command or a defined protocol condition during task execution.

**(Note:** This v0.7 bootstrap reinforces continuity, capability awareness, _initial site health check, AND mandatory current time check_ to improve agent grounding, prevent timestamp drift, and enable time-aware persona interactions.)\*

**(Mid-Session Refresh Trigger Note:** Common phrases like "refresh context", "reload shc", or "initialize project moonshot" should trigger a re-execution of this bootstrap procedure. See `aipo-core/docs/_shc_refactor_v0.1/chunks/si_core_comms.md` for the defined trigger keywords.)\*
