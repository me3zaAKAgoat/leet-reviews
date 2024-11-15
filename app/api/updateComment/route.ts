import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CommentUpdate, CommentUpdateType } from "@/lib/types";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const data: CommentUpdateType = await req.json();

  const mySchema = CommentUpdate.safeParse(data);
  if (!mySchema.success) {
    return NextResponse.json(
      { message: mySchema.error.errors },
      { status: 400 },
    );
  }

  try {
    // check if user already liked that post ?
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId: data.commentId,
          userId: req.auth?.user?.id || "",
        },
      },
    });
    if (existingLike) {
      return NextResponse.json(
        { message: "You already liked this comment" },
        { status: 400 },
      );
    }
    // Update the comment
    await prisma.commentLike.create({
      data: {
        commentId: data.commentId,
        userId: req.auth?.user?.id || "",
      },
    });

    await prisma.comment.update({
      where: {
        id: data.commentId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ message: "Comment Liked" }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Error Updating Comment" },
      { status: 500 },
    );
  }
});
