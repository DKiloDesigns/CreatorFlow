// src/auth.middleware.ts
// Minimal config for middleware - NO ADAPTER

import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth } = NextAuth({
  // NO adapter configured here
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt", // Middleware only needs to check the JWT
  },
  secret: process.env.AUTH_SECRET,
  // trustHost is not supported in this version of NextAuth
  // Using cookies configuration instead
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false // Force false for local dev debug
      }
    }
  }
})

// Note: We export 'handlers' here mainly for consistency, 
// but the middleware itself will only import 'auth' from this file. 