import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    username?: string;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    accessToken?: string;
  }
} 