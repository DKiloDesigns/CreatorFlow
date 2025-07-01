proceed to the TODO sweep# Problem Report: GitHub OAuth Sign-In Fails (`client_id is required`)

**Date:** 2024-06-20  
**Environment:**  
- Project: CreatorFlow (Next.js 15, NextAuth.js, Prisma)  
- Local Dev: macOS, Node.js, running on port 3001  
- NextAuth Providers: GitHub, Google, Facebook, Apple

---

## Summary

GitHub OAuth sign-in fails with a `client_id is required` error, despite correct `.env` configuration and public/verified GitHub email. No user is created in the database, and the NextAuth callback debug logs are never triggered.

---

## Steps to Reproduce

1. Start the dev server:  
   `cd creatorflow-app && npm run dev -- --port 3001`
2. Visit `/signin` and click the GitHub sign-in button.
3. Authorize the app on GitHub when prompted.
4. Observe:  
   - Redirects back to `/signin?error=OAuthSignin`
   - Server logs show repeated `[next-auth][error][SIGNIN_OAUTH_ERROR] ... client_id is required`
   - No `[NextAuth][GitHub][profile]` or callback logs appear.

---

## What Was Tried

- Verified `.env` contains correct `GITHUB_ID` and `GITHUB_SECRET`.
- Made GitHub email public and verified.
- Deleted all users/accounts with `null` email from the database.
- Restarted dev server and cleared build artifacts.
- Confirmed provider config requests `user:email` scope.
- Added debug logging to NextAuth callbacks and GitHub provider `profile` function.
- Confirmed other providers (Google) work as expected.

---

## Relevant Logs

```
[next-auth][error][SIGNIN_OAUTH_ERROR] 
https://next-auth.js.org/errors#signin_oauth_error client_id is required {
  error: {
    message: 'client_id is required',
    stack: 'TypeError: client_id is required\n' +
      '    at new BaseClient ...',
    name: 'TypeError'
  },
  providerId: 'github',
  message: 'client_id is required'
}
```

---

## Suspected Causes

- NextAuth is not receiving `GITHUB_ID` from the environment at runtime.
- Possible `.env` loading issue, variable typo, or process.env not being passed to the NextAuth config.
- Build artifact or hot-reload issue causing stale environment variables.

---

## Next Steps / Recommendations

- Double-check `.env` file location and variable names (`GITHUB_ID`, `GITHUB_SECRET`).
- Add a `console.log(process.env.GITHUB_ID, process.env.GITHUB_SECRET)` at the top of your NextAuth config to verify values are loaded at runtime.
- Ensure the dev server is restarted after any `.env` changes.
- Check for `.env.local` or other environment overrides.
- If using Vercel or another deployment, ensure environment variables are set in the dashboard.

---

## Status

- **RESOLVED:** GitHub OAuth sign-in is now working correctly.

---

## Resolution Summary

**Date:** 2024-06-20  
**Resolved by:** AI Assistant

### Root Cause
The issue was a mismatch between environment variable names in the code and the actual `.env` file:

1. In `src/auth.ts`, the GitHub provider was configured to use `process.env.GITHUB_ID` and `process.env.GITHUB_SECRET`
2. However, in the `.env` file, the variables were actually named `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
3. This naming discrepancy caused the "client_id is required" error since NextAuth couldn't find the expected environment variables

### Solution Implemented
1. Updated the GitHub provider configuration in `src/auth.ts` to use the correct environment variable names:
   ```typescript
   GitHubProvider({
     clientId: process.env.GITHUB_CLIENT_ID!,
     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
     // ...
   })
   ```

2. Added debug logging to verify environment variables are being loaded correctly:
   ```typescript
   console.log('[NextAuth][Debug] GitHub OAuth ENV Variables:', {
     GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'Set (value hidden)' : 'Not set',
     GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'Set (value hidden)' : 'Not set',
   });
   ```

3. Confirmed that `src/auth.middleware.ts` was already using the correct environment variable names

4. Restarted the development server to apply the changes

### Verification
The GitHub OAuth sign-in now works correctly without the "client_id is required" error. The application successfully authenticates with GitHub and creates user accounts as expected.

### Lessons Learned
- Always ensure environment variable names are consistent between code and `.env` files
- Add debug logging for environment variables when troubleshooting OAuth issues
- Check all authentication-related files when debugging OAuth problems, as there may be multiple configurations (in this case, both `auth.ts` and `auth.middleware.ts`)