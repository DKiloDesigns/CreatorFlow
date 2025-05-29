# Context Entry

**Last Updated:** 2025-05-28

**Project:** CreatorFlow (Next.js App Router, NextAuth, Prisma, Stripe, Cloudinary)

**Current Goal:** Complete Stripe account setup and unblock webhook integration for billing features.

**Session Summary (2025-05-28):**
- Attempted to resume dashboard development and resolve authentication/session issues.
- Discovered Tailwind styles were not being applied due to a misconfigured PostCSS plugin; fixed by updating `postcss.config.js` to use `tailwindcss` instead of `@tailwindcss/postcss`.
- Dev server was inaccessible on port 3001. Diagnosed that Node.js version was too new (v22) and not supported by Next.js 15. Switched to Node 20 using nvm, cleaned and reinstalled all dependencies.
- Further attempts to start the dev server revealed that the shell was still using Node 16, which is not supported. Ensured nvm was used in the correct shell and restarted the server.
- New blocker: The server now fails to start due to a missing `autoprefixer` module, causing a build error in Next.js. Also, the `.env` file is missing required secrets for NextAuth, GitHub OAuth, and Stripe, which will block authentication and billing features.

**Session Summary (2025-05-28, continued):**
- Installed `autoprefixer` to resolve build error; dev server now compiles and is accessible.
- Began Stripe account setup for webhook integration. Stripe requires a public URL for the business website field; using a GitHub repo or similar public page is acceptable for development.
- Stripe webhook endpoint and secret setup is pending until account creation is complete.

**Current Status & Blocking Issue:**
- Stripe integration is blocked until account setup is finished and a webhook secret is obtained.
- All other environment blockers (Node version, autoprefixer) have been resolved.

**Next Steps (Next Session):**
1. Complete Stripe account setup using a public URL (e.g., GitHub repo) for the business website field.
2. Add webhook endpoint in Stripe dashboard and copy the signing secret to `.env`.
3. Test webhook integration locally using Stripe CLI if needed.
4. Resume billing and subscription feature development once Stripe is fully integrated.

**Files Created/Significantly Modified (2025-05-28):**
- `creatorflow-app/postcss.config.js` (Fixed Tailwind plugin)
- `.nvmrc` (if added, to enforce Node 20)

**Outstanding Blockers/Issues:**
- `autoprefixer` missing, causing build failure.
- `.env` missing required secrets for NextAuth, GitHub OAuth, and Stripe.
- Node version must be 20+ in all shells.
- Authentication/session issues in API routes (pending environment fix).

**Files Created/Significantly Modified (2025-05-06):**
- `creatorflow-app/src/auth.ts` (Modified significantly - Adapter toggled, session callback logic updated)
- `creatorflow-app/src/app/api/posts/route.ts` (Added logging, later removed/implicitly reverted by testing different flows)
- `creatorflow-app/src/app/api/auth/callback/[platform]/route.ts` (Deleted)
- `creatorflow-app/src/lib/encryption.ts` (Deleted)
- `creatorflow-app/next.config.ts` (Added/removed experimental flag)
- `creatorflow-app/src/middleware.ts` (Modified significantly - Forced Node.js runtime, simplified export, changed import source)
- `creatorflow-app/src/auth.middleware.ts` (Created)

**Files Checked/Referenced (2025-05-06):**
- `creatorflow-app/.env`
- `creatorflow-app/docker-compose.yml`
- `creatorflow-app/package.json`
- `creatorflow-app/src/app/api/auth/[...nextauth]/route.ts`
- `creatorflow-app/src/app/dashboard/content/_components/content-calendar.tsx` (Implied via error messages)
- `creatorflow-app/src/app/dashboard/content/_components/post-composer.tsx` (Implied via error messages)

--- Previous Entries Below ---

**Session Summary (Before 2025-05-06):**
This session focused entirely on troubleshooting the authentication flow, which was blocking access to protected dashboard routes.
Key steps included:
- Diagnosing and resolving middleware (`src/middleware.ts`) execution issues, ultimately by disabling Turbopack in the dev script (`package.json`).
- Setting up the NextAuth.js API handler (`src/app/api/auth/[...nextauth]/route.ts`) to resolve 404 errors on the sign-in page.
- Configuring the GitHub OAuth provider in `src/auth.ts` and `.env`.
- Resolving a `TOKEN_ENCRYPTION_KEY` error by generating and setting the key in `.env`.
- Identifying that API routes (`/api/posts`) were returning `{"error":"Unauthorized"}` after successful login because the session object lacked the `user.id`.
- Adding `jwt` and `session` callbacks to `src/auth.ts` to inject the `user.id` into the session.

**Current Status & Blocking Issue:**
Despite adding the session callbacks and ensuring the server was restarted and the user signed out/in, the `GET /api/posts` route still returns `{"error":"Unauthorized"}` when accessed via the `ContentCalendar` component after login. The immediate next step is to determine why the `user.id` is not present in the session object within the context of that API route handler.

**Files Created/Significantly Modified:**
- `creatorflow-app/src/middleware.ts`
- `creatorflow-app/package.json`
- `creatorflow-app/src/app/api/auth/[...nextauth]/route.ts` (Created)
- `creatorflow-app/next.config.ts`
- `creatorflow-app/.env` (User modified)
- `creatorflow-app/src/auth.ts`
- `creatorflow-app/src/lib/encryption.ts`

**Files Checked/Referenced:**
- `creatorflow-app/src/app/api/posts/route.ts`
- `creatorflow-app/src/app/dashboard/content/page.tsx`
- `creatorflow-app/src/app/dashboard/content/_components/post-composer.tsx`
- `creatorflow-app/src/app/dashboard/content/_components/content-calendar.tsx`

## Core Technologies

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Shadcn/UI
*   **Database:** PostgreSQL (managed via Docker Compose)
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js v5 (Auth.js)
*   **Billing:** Stripe
*   **Media:** Cloudinary (Direct Client-Side Uploads)
*   **UI Components:** FullCalendar, react-icons, react-dropzone, sonner (toasts)

## Current Status & Focus

*   **Account Management:** Frontend UI built, basic backend APIs for connect/disconnect/list exist. OAuth logic implementation (token exchange, etc.) is the main remaining task.
*   **Content Scheduling:** 
    *   Backend models and DB migrated.
    *   Core API routes (`/api/posts` POST/GET) implemented with auth.
    *   Frontend `PostComposer` is functional for text, platform selection, date/time, and direct Cloudinary media uploads (via signed URLs from `/api/upload/sign`).
    *   Frontend `ContentCalendar` fetches from `/api/posts` and displays events with custom styling/icons.
    *   Remaining: Actual post publishing/scheduling mechanism (cron/background task), Template management, Post Detail modal.
*   **Billing & Subscriptions:**
    *   DB schema updated with Stripe fields.
    *   Backend API routes created for Checkout sessions and Customer Portal sessions.
    *   Backend webhook handler (`/api/webhooks/stripe`) created but **contains unresolved TypeScript errors** related to Stripe object types. Debugging requires Stripe CLI testing.
    *   Frontend integration (buttons, redirects) not yet started.
*   **Overall:** Core structure is solid. Focus has been on Content Scheduling features and initial Stripe backend setup. Key next steps involve resolving Stripe webhook issues, implementing OAuth details, and building the actual scheduling/publishing engine.

## Key Files Created/Modified This Session (2025-05-02)

*   `creatorflow-app/prisma/schema.prisma`
*   `creatorflow-app/src/app/dashboard/content/page.tsx`
*   `creatorflow-app/src/app/dashboard/content/_components/post-composer.tsx`
*   `creatorflow-app/src/app/dashboard/content/_components/content-calendar.tsx`
*   `creatorflow-app/src/app/api/posts/route.ts`
*   `creatorflow-app/src/app/api/upload/sign/route.ts`
*   `creatorflow-app/src/app/api/billing/create-checkout-session/route.ts`
*   `creatorflow-app/src/app/api/billing/create-portal-session/route.ts`
*   `creatorflow-app/src/app/api/webhooks/stripe/route.ts`
*   `creatorflow-app/src/globals.css`
*   `creatorflow-app/docker-compose.yml`

## Outstanding Blockers/Issues

*   TypeScript errors in `creatorflow-app/src/app/api/webhooks/stripe/route.ts` require debugging with Stripe CLI test events and logs.
*   Placeholder OAuth logic in Account Management routes needs implementation.
*   No actual post publishing/scheduling system exists yet. 