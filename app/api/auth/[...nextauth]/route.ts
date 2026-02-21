import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  pages: {
    signIn: "/signin",
  },

 callbacks: {
  async jwt({ token, user }) {
    // runs on sign in
    if (user) {
      token.role = (user as any).role;
      token.id = (user as any).id;
    }
    return token;
  },

  async session({ session, token }) {
    // runs on every request
    (session.user as any).role = (token as any).role;
    (session.user as any).id = (token as any).id;
    return session;
  },
},
});

export { handler as GET, handler as POST };

