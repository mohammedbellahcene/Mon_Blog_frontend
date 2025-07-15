import CredentialsProvider from 'next-auth/providers/credentials';
import { auth } from '@/lib/api';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { data } = await auth.login({
            email: credentials?.username || '',
            password: credentials?.password || '',
          });

          return {
            id: data.user.id.toString(),
            name: data.user.username,
            username: data.user.username,
            email: data.user.email,
            accessToken: data.accessToken,
            roles: data.user.roles,
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.username = user.username;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
        session.user.username = typeof token.username === "string" ? token.username : undefined;
        session.user.roles = token.roles;
      }
      // Vérification côté backend
      if (session.user?.accessToken) {
        try {
          const res = await fetch("http://localhost:8080/api/auth/validate", {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          });
          if (!res.ok) {
            return null;
          }
        } catch (e) {
          return null;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
}; 