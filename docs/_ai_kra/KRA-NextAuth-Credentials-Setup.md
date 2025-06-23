# KRA: NextAuth Credentials Provider Setup (CreatorFlow)

## Overview
This document summarizes the working configuration for NextAuth Credentials authentication in the CreatorFlow app, including troubleshooting steps, architectural decisions, and a future roadmap. It is intended as a reference for future agents or developers.

---

## 1. **Authentication Architecture**
- **NextAuth Credentials Provider** is used for email/password login.
- **API Route Location:**
  - The NextAuth handler **must be in the Pages Router**: `pages/api/auth/[...nextauth].ts`.
  - The App Router (`src/app/api/auth/[...nextauth]/route.ts`) is **not** used for NextAuth due to incomplete support for credentials POST callbacks.
- **Session Context:**
  - The app is wrapped in `<SessionProvider>` via a client component (`src/app/providers.tsx`), imported and used in `src/app/layout.tsx`.
  - All components using `useSession` must be client components (add `"use client";` at the top).

---

## 2. **Prisma & Database**
- **Database:** PostgreSQL (not SQLite)
- **Prisma Schema:**
  - `User` model includes a `password` field (plaintext for dev; hash for prod).
- **Seeding:**
  - Seed script creates a test user: `test@example.com` / `testpassword`.
- **Migrations:**
  - Ensure all migrations are applied and the schema is in sync with the database.

---

## 3. **Troubleshooting Checklist**
- **405 on /api/auth/callback/credentials:**
  - Ensure the handler is in `pages/api/auth/[...nextauth].ts` (Pages Router), not App Router.
  - Remove any conflicting files in `src/app/api/auth/`.
- **`useSession` must be wrapped in `<SessionProvider>`:**
  - Use a client component to wrap your app in `<SessionProvider>`.
  - Mark any component using `useSession` with `"use client";`.
- **Prisma errors (missing fields):**
  - Check that the database schema matches `prisma/schema.prisma`.
  - Run `prisma migrate dev` and reseed if needed.

---

## 4. **Current State (as of 2024-06)**
- Credentials login works end-to-end.
- No API route conflicts.
- Session context is available in all client components.
- Database and Prisma are in sync.

---

## 5. **Future Roadmap / Recommendations**
- [ ] **Password Hashing:** Store hashed passwords in production.
- [ ] **User Registration:** Add a registration flow for new users.
- [ ] **Password Reset:** Implement password reset via email.
- [ ] **Social Logins:** Expand support for OAuth providers as needed.
- [ ] **Error Handling:** Improve user feedback for failed logins.
- [ ] **Security Review:** Periodically review authentication and session security.

---

## 6. **References**
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js App Router vs Pages Router](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-app-directory)

---

**For future agents:**
- If you encounter 405 errors or session context issues, check for API route conflicts and ensure all session hooks are used in client components wrapped by `<SessionProvider>`.
- Use this KRA as a baseline for troubleshooting and onboarding. 