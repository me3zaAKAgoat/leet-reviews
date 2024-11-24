import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { commentSchema, CommentWithUser } from "@/lib/types";
import { generateAnonymousId } from "@/lib/utils";
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
  let newComment: CommentWithUser = {} as CommentWithUser;
  try {
    const newCom = await prisma.comment.create({
      data: {
        id: data.id,
        comment: data.comment,
        reviewId: data.reviewId,
        userId: req.auth?.user?.id ?? "",
        anonymous: data.anonymous,
      },
    });
    const foundComment = await prisma.comment.findUnique({
      where: {
        id: newCom.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        commentLikes: {
          select: {
            commentId: true,
          },
        },
      },
    });

    if (!foundComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }
    if (foundComment.anonymous) {
      foundComment.user = {
        id: foundComment.user.id,
        name: generateAnonymousId(foundComment.user.id),
        image: "",
      };
    }
    newComment = foundComment;
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Error Adding Comment" },
      { status: 500 },
    );
  }

  return NextResponse.json({ comment: newComment }, { status: 200 });
});
