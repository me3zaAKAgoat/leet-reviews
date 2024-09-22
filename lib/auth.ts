import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import FortyTwo from "next-auth/providers/42-school";
import NextAuth, { NextAuthConfig } from "next-auth";

const providers = [
  FortyTwo({
    clientId: process.env.FORTYTWO_CLIENT_ID ?? "",
    clientSecret: process.env.FORTYTWO_CLIENT_SECRET ?? "",
  }),
];

export const providerFortyTwo = {
  id: providers[0].id,
  name: providers[0].name,
};

export const authOptions: NextAuthConfig = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  basePath: "/api/auth",
  pages: {
    signIn: "/signin",
    //     signOut: "/signout",
    error: "/error", // Error code passed in query string as ?error=
    verifyRequest: "/verify-request", // (used for check email message)
    newUser: "/dashboard", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
