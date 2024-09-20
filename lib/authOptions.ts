import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import FortyTwo from "next-auth/providers/42-school";

export const authOptions = {
  providers: [
    FortyTwo({
      clientId: process.env.FORTYTWO_CLIENT_ID ?? "",
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: PrismaAdapter(prisma),
};
