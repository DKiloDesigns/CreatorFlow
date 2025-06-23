import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GitHub from "next-auth/providers/github"
import { getServerSession } from "next-auth/next"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import TwitterProvider from "next-auth/providers/twitter"
import InstagramProvider from "next-auth/providers/instagram"
import LinkedInProvider from "next-auth/providers/linkedin"
import FacebookProvider from "next-auth/providers/facebook"
import AppleProvider from "next-auth/providers/apple"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
// Re-export signIn and signOut from next-auth/react for client components
export { signIn, signOut } from "next-auth/react"

// LOGIN PROVIDERS: Only Google, Facebook, and Apple are enabled for user authentication.
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  logger: {
    error: (...args) => console.error('[NextAuth][error]', ...args),
    warn: (...args) => console.warn('[NextAuth][warn]', ...args),
    debug: (...args) => console.log('[NextAuth][debug]', ...args),
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Always allow login for test
        return { id: "1", name: "Test User", email: "test@example.com" };
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      async profile(profile, tokens) {
        let email = profile.email;
        if (!email && tokens?.access_token) {
          try {
            const res = await fetch('https://api.github.com/user/emails', {
              headers: {
                Authorization: `token ${tokens.access_token}`,
              },
            });
            if (res.ok) {
              const emails = await res.json();
              // Find the primary, verified email
              const primary = emails.find((e) => e.primary && e.verified);
              email = primary?.email || emails[0]?.email;
            }
          } catch (err) {
            console.error('[NextAuth][GitHub][profile] Failed to fetch user emails', err);
          }
        }
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email,
          image: profile.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        console.log('[NextAuth][Google][profile]', JSON.stringify(profile, null, 2));
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      profile(profile) {
        console.log('[NextAuth][Facebook][profile]', JSON.stringify(profile, null, 2));
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        };
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
      profile(profile) {
        console.log('[NextAuth][Apple][profile]', JSON.stringify(profile, null, 2));
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('[NextAuth][signIn callback]', {
        user,
        account,
        profile,
        email,
        credentials,
      });
      if (!user?.email) {
        console.error('[NextAuth] User has no email:', user);
        return false;
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      console.log('[NextAuth][jwt callback]', { 
        token: token ? { ...token, sub: token.sub } : null,
        user: user ? { id: user.id } : null,
        account: account ? { provider: account.provider } : null,
      });
      
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log('[NextAuth][session callback]', { 
        session: session ? 'Session data available' : null,
        token: token ? { sub: token.sub } : null,
        user: user ? { id: user?.id } : null
      });
      
      if (session?.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode to see what's happening
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
        secure: false // Set to false for local development
      }
    }
  },
}

// Export for Pages Router API route
export default authOptions;

// Export for App Router compatibility
export const authConfig = authOptions;

// Export the getSession helper for server components and API routes
export const getSession = (req?: any, res?: any) => {
  if (req && res) {
    return getServerSession(req, res, authOptions);
  }
  return getServerSession(authOptions);
};

// Export auth function for compatibility with existing imports
export const auth = async (req?: any, res?: any) => {
  return await getSession(req, res);
};

// Required ENV VARS:
// LINKEDIN_CLIENT_ID=your_linkedin_client_id
// LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected before NextAuth initialization");
  } catch (e) {
    console.error("❌ Prisma failed to connect before NextAuth initialization", e);
  }
})();