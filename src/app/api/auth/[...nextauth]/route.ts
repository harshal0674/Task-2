import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "student" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Dummy auth for educational purposes
        if (credentials?.username === "student" && credentials?.password === "password") {
          return { id: "1", name: "Student", email: "student@example.com" };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
