import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { auth } from '@/lib/api';

const handler = NextAuth({
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

          console.log('LOGIN RESPONSE', data);

          return {
            id: data.user.id.toString(),
            name: data.user.username,
            username: data.user.username,
            email: data.user.email,
            accessToken: data.accessToken,
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
        session.user.username = typeof token.username === "string" ? token.username : undefined;
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
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST }; 