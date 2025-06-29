import 'next-auth';
import NextAuth from "next-auth"

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    username?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires: string;
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    accessToken?: string;
  }
} 