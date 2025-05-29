This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Setup for Multiple Dev Instances

If you want to run multiple dev servers (e.g., on ports 3000 and 3001), create a `.env.development.local` in the root of `creatorflow-app` for each instance. Example for port 3001:

```
NEXTAUTH_URL="http://localhost:3001"
AUTH_SECRET="your-nextauth-secret-key-here"
```

**Reminder:**
- Always keep `NEXTAUTH_URL` and `AUTH_SECRET` in sync across `.env`, `.env.development.local`, and both NextAuth configs (`src/auth.ts` and `src/auth.middleware.ts`).
- Update any scripts or docs if you change the port or secret.

## NextAuth Config Consistency Checklist

- [x] Both `src/auth.ts` and `src/auth.middleware.ts` use the same `secret` (`process.env.AUTH_SECRET`).
- [x] Both use `session: { strategy: "jwt" }`.
- [x] Both use the same session cookie name and options (`next-auth.session-token`, `sameSite: 'lax'`, `path: '/'`, `secure: false` for dev).
- [x] If you change the secret, session strategy, or cookie settings, update both files and your `.env`.

## Port/URL Consistency Check

Before starting development, run:

```
npm run check:ports
```

This will scan your codebase for any hardcoded `localhost:3000` or `localhost:3001` references and warn you if any are found. Update them to use environment variables or the correct port as needed.
