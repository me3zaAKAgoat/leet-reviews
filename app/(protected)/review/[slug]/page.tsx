import CommentSection from "@/components/CommentSection";
import ReviewNotFound from "@/components/ReviewNotFound";
import ReviewShowCase from "@/components/ReviewShowCase";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function ReviewShowcase({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  const { slug } = params;
  const reviewData = await prisma.review.findUnique({
    where: {
      slug: slug,
    },
    include: {
      company: true,
      comments: {
        orderBy: {
          likes: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          commentLikes: {
            where: {
              userId: session?.user?.id,
            },
            select: {
              commentId: true,
            },
          },
        },
      },
    },
  });

  if (!reviewData) {
    return <ReviewNotFound reviewId={slug} />;
  }
  // console.log(reviewData);
  // reviewData.comments.commentLikes is an array exists for each comment if the user has liked the comment then array size > 0
  // console.log(reviewData.comments);
  return (
    <>
      <ReviewShowCase reviewData={reviewData} />
      <CommentSection
        reviewId={reviewData.id}
        reviewComments={reviewData.comments}
      />
    </>
  );
}
