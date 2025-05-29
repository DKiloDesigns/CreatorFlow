## 2025-05-26: Dev Environment Upgrades
- Dedicated dev server script on port 3001 (`npm run dev:3001`).
- All code, scripts, and docs updated to use port 3001 (no more hardcoded 3000 issues).
- `.env` and `.env.development.local` usage documented for multi-instance dev.
- `/api/debug/session` endpoint added for session/cookie debugging (dev only).
- NextAuth config checklist in README to keep configs in sync.
- Automated port/URL check script (`npm run check:ports`) added.
- Session expiry handler in UI: users redirected to sign-in if session is missing.
- Lloyd persona doc fully synced and loaded for all agent ops.

**Next Focus:**
- Debug and resolve the session/auth issue in API routes (main technical blocker).
- Continue feature development and monetization after session/auth is stable.

## 2025-05-28: Major Blockers Cleared
- Prisma import path issue resolved (all imports now use @prisma/client).
- Dashboard loads successfully on Node 20.
- Stripe webhook setup in progress (webhook secret obtained, integration pending verification).
- Tailwind/PostCSS config fixed for Next.js 15+.
- Previous build and port issues resolved.
- **Next:** Verify Stripe integration and run end-to-end tests for billing and post publishing. 