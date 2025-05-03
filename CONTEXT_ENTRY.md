# Project Context: CreatorFlow

**Last Updated:** 2025-05-02

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