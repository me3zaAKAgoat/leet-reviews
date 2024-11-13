import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const data = await req.json();
  if (!data.name)
    return NextResponse.json(
      { message: "Company name is required" },
      { status: 400 },
    );

  try {
    const newCompany = await prisma.company.create({
      data: {
        name: data.name,
        website: data.website,
        location: data.location,
      },
    });
    return NextResponse.json(newCompany);
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
});
