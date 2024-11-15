import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { commentSchema } from "@/lib/types";
import { NextResponse } from "next/server";

type CommentFormValue = {
  id: string;
  comment: string;
  reviewId: string;
  anonymous: boolean;
};

export const POST = auth(async function POST(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  const data: CommentFormValue = await req.json();
  console.log(data);

  const mySchema = commentSchema.safeParse(data);
  if (!mySchema.success) {
    return NextResponse.json(
      { message: mySchema.error.errors },
      { status: 400 },
    );
  }

  try {
    await prisma.comment.create({
      data: {
        id: data.id,
        comment: data.comment,
        reviewId: data.reviewId,
        userId: req.auth?.user?.id ?? "",
        anonymous: data.anonymous,
      },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Error Adding Comment" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "You want to add a message ?!" },
    { status: 200 },
  );
});
