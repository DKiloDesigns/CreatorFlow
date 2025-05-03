import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
// Import providers here (e.g., import Google from "next-auth/providers/google")

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Add providers here
    // Example: Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    // We will add custom OAuth providers for Instagram, TikTok, etc. later
  ],
  session: {
    strategy: "jwt", // Using JWT for session strategy is often recommended
  },
  callbacks: {
    // Add callbacks here if needed later (e.g., modify session token)
  },
  // Add secret for production
  // secret: process.env.AUTH_SECRET,
  // Add pages configuration if needed for custom sign-in page
  // pages: {
  //   signIn: '/auth/signin',
  // }
}) 