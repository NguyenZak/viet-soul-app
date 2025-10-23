import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase();
        const password = credentials?.password;
        if (email === "demo@vietsoul.app" && password === "demo123") {
          return { id: "1", name: "VietSoul Demo", email } as any;
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/login" },
});

export { handler as GET, handler as POST };


