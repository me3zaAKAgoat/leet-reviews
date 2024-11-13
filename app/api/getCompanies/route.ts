import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  try {
    const companies = await prisma.company.findMany();
    return NextResponse.json(companies);
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
});
