import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GitHub from "next-auth/providers/github"
import { getServerSession } from "next-auth/next"
import type { NextAuthOptions } from "next-auth"
// Re-export signIn and signOut from next-auth/react for client components
export { signIn, signOut } from "next-auth/react"

const prisma = new PrismaClient()

// Define the auth config for NextAuth v4
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/error',
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
}

// Export for Pages Router API route
export default authOptions;

// Export for App Router compatibility
export const authConfig = authOptions;

// Export the getSession helper for server components
export const getSession = () => getServerSession(authOptions);

// Export auth function for compatibility with existing imports
export const auth = async () => {
  const session = await getServerSession(authOptions);
  return session;
};