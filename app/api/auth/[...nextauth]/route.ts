import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn(params) {
      if (!params.user.email) {
        return false;
      }
      try {
        // Check if the user already exists
        const existingUser = await prismaClient.user.findUnique({
          where: {
            email: params.user.email,
          },
        });

        // If the user doesn't exist, create a new one
        if (!existingUser) {
          await prismaClient.user.create({
            data: {
              email: params.user.email,
              provider: "Google",
            },
          });
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
