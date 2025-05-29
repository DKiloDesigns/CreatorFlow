# CreatorFlow Developer Guide

This document provides important information for developers working on the CreatorFlow project to avoid common issues and ensure smooth development.

## Common Issues and Solutions

### 1. Port Conflicts (EADDRINUSE: address already in use :::3001)

The application runs on port 3001 by default. If you encounter port conflicts:

- Use the built-in script to free the port: `npm run free-port`
- The development scripts (`npm run dev` and `npm run dev:3001`) automatically run this script
- If you still have issues, manually check and kill processes:
  ```bash
  lsof -i :3001    # Find processes using port 3001
  kill -9 <PID>    # Kill the process with the given PID
  ```

### 2. NextAuth/Next.js Authentication Issues

The application uses NextAuth v4 with both Pages Router and App Router configurations. If you encounter authentication errors:

- Make sure the auth configuration in `src/auth.ts` is properly set up for NextAuth v4
- Ensure client components that use NextAuth are marked with `"use client"` directive
- Check that server components use `getSession()` from `@/auth` for authentication
- If you see errors about missing session data, verify that cookies are being properly set

For NextAuth v4 with App Router, we use the following pattern:

```typescript
// In src/auth.ts
import { getServerSession } from "next-auth/next"
export const getSession = () => getServerSession(authOptions);

// In API routes
import { getSession } from "@/auth"
const session = await getSession();
```

### 3. Build Artifacts Issues

If you encounter errors related to missing build artifacts:

```
Error: ENOENT: no such file or directory, open '.next/server/middleware-manifest.json'
```

- Run `npm run clean` to remove the `.next` directory
- For more persistent issues, run `npm run clean-install` to remove both `.next` and `node_modules` and reinstall dependencies
- The development scripts automatically clean build artifacts before starting

### 4. Environment Variables

- Make sure all required environment variables are properly set in your `.env` file
- Required variables include:
  - `AUTH_SECRET` (for NextAuth)
  - `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` (for GitHub OAuth)
  - `DATABASE_URL` (for Prisma)
- For NextAuth v4, you may need to set `NEXTAUTH_URL` in production environments

### 5. Client vs Server Components

- Components that use NextAuth client functions (`signIn`, `signOut`, `useSession`) must be marked with `"use client"` directive
- Server components should use `getSession()` from `@/auth` to access session data
- Be careful not to mix client-side and server-side authentication methods in the same component

## Development Workflow

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables in `.env`
4. Start the development server: `npm run dev`
5. Access the application at http://localhost:3001

## Useful Commands

- `npm run dev` - Start the development server (cleans artifacts and frees port 3001)
- `npm run build` - Build the application for production
- `npm run clean` - Clean Next.js build artifacts
- `npm run clean-install` - Clean build artifacts and node_modules, then reinstall dependencies
- `npm run free-port` - Free port 3001 if it's in use
- `npm run check:ports` - Check for hardcoded port references in the codebase

## Troubleshooting

If you encounter issues not covered in this guide:

1. Clean the build artifacts and reinstall dependencies: `npm run clean-install`
2. Make sure your environment variables are correctly set
3. Check that port 3001 is free: `npm run free-port`
4. Restart your development server: `npm run dev`
5. Check browser console and server logs for specific error messages