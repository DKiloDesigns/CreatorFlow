import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  /**
   * Extend the built-in JWT types
   */
  interface JWT {
    id?: string;
  }
}