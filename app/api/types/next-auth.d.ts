import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add ID field
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Ensure User has an ID
  }
}
