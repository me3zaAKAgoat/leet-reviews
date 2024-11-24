import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ReviewFormValues, reviewSchema } from "@/lib/types";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export const POST = auth(async function POST(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const data: ReviewFormValues = await req.json();
  console.log(data);

  // parse data using zod
  const mySchema = reviewSchema.safeParse(data);
  if (!mySchema.success) {
    return NextResponse.json(
      { message: mySchema.error.errors },
      { status: 400 },
    );
  }
  // Add review to database

  try {
    await prisma.review.create({
      data: {
        companyId: data.companyId,
        contractType: data.contractType,
        jobSource: data.jobSource,
        startDate: data.startDate,
        endDate: data.endDate,
        salaryType: data.salaryType,
        exactSalary: data.salary,
        salaryRangeMin: data.salaryMin,
        salaryRangeMax: data.salaryMax,
        jobTitle: data.jobTitle,
        location: data.location,
        rating: data.rating,
        wouldRecommend: data.recommend,
        isAnonymous: data.anonymous,
        interviewDifficulty: data.interviewDifficulty,
        applicationDate: data.applicationDate,
        interviewProcess: data.interviewProcess,
        description: data.description,
        userId: req.auth?.user?.id ?? "",
        slug: nanoid(7),
      },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Error adding review" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Review added" });
});
