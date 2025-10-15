# floai.studio Application

This directory contains the core Next.js application for floai.studio, an AI-powered social media management platform. It's built with Next.js, TypeScript, and Material-UI, providing tools for content scheduling, analytics, and brand deal management.

## Getting Started

To run this application, ensure you have Node.js v20+ and npm v10+ installed.

### Installation

1.  **Navigate to the project root:**
    ```bash
    cd /Users/darrellmayberry/CreatorFlow
    ```
2.  **Install root dependencies:**
    ```bash
    npm install
    ```
3.  **Navigate to the app directory and install dependencies:**
    ```bash
    cd creatorflow-app
    npm install
    ```

### Development

To start the development server, you can use the following commands from the project root:

```bash
# Start the development server on default port (usually 3000)
npm run dev

# Start the development server on port 3001
npm run dev:3001
```

These commands will automatically:
1.  Free up the required port if it's in use
2.  Clean Next.js cache
3.  Start the Next.js development server

Open `http://localhost:3001` (or your default port) in your browser to see the result.

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

This will scan your codebase for any hardcoded `localhost:3001` references and warn you if any are found. Update them to use environment variables or the correct port as needed.
