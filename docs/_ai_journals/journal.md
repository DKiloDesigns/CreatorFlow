---
**Session End: 2025-05-02 (Approx)**

*   **Focus:** Content Scheduling (API, Frontend Integration, Media Uploads), Stripe Billing (Backend Setup).
*   **Content Scheduling:**
    *   Added Prisma models (`Post`, `Template`, `Group`), migrated DB successfully after fixing Node.js v16 -> v22 incompatibility.
    *   Created/refined frontend: `ContentPage`, `PostComposer` (w/ date/time, Dropzone), `ContentCalendar` (w/ FullCalendar, API fetch, custom render).
    *   Implemented backend: `POST /api/posts` (create), `GET /api/posts` (fetch) using `@/auth`.
    *   Implemented Cloudinary direct upload: `POST /api/upload/sign` backend, integrated `react-dropzone` and upload logic into `PostComposer`.
    *   Connected `PostComposer` -> `POST /api/posts`.
    *   Connected `ContentCalendar` -> `GET /api/posts`.
*   **Stripe Billing:**
    *   Added Stripe fields to `User` model, migrated DB.
    *   Installed Stripe SDK.
    *   Created backend API routes: `POST /api/billing/create-checkout-session`, `POST /api/billing/create-portal-session`.
    *   Created `POST /api/webhooks/stripe` handler, added logging to debug persistent type errors (next step).
*   **Key Decisions/Issues:**
    *   Used Docker Compose for local PostgreSQL setup.
    *   Resolved Node.js v16 conflict with Prisma/WASM by upgrading to v22.
    *   Encountered persistent Stripe SDK type errors in webhook handler; deferred full resolution pending debug logs from Stripe CLI testing.
    *   Used direct Cloudinary uploads via signed URLs.
*   **Next Steps:** Debug Stripe webhook types using Stripe CLI logs; Implement frontend for billing; Implement Template Mgmt; Implement actual post publishing/scheduling. 