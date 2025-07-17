import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { mockUsers } from "@/lib/mock-db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
            return null;
        }

        const userFound = mockUsers.find(
          (user) => user.email === credentials.email
        );

        if (!userFound) {
            console.log("User not found:", credentials.email);
            return null;
        }

        if (userFound.password === credentials.password) {
          console.log("User logged in:", userFound.email);
          return { id: userFound.id, name: userFound.name, email: userFound.email };
        } else {
          console.log("Invalid password for user:", credentials.email);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST, handler as authOptions };