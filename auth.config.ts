import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour in seconds
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize() {
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;