import CommentSection from "@/components/CommentSection";
import ReviewNotFound from "@/components/ReviewNotFound";
import ReviewShowCase from "@/components/ReviewShowCase";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateAnonymousId } from "@/lib/utils";

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
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      company: true,
      comments: {
        orderBy: {
          likes: "desc",
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
  // Sanitize comments to remove user data for anonymous comments
  reviewData.comments = reviewData.comments.map((comment) => {
    if (comment.anonymous) {
      comment.user = {
        id: comment.user.id, // this will leak the user id , but its fine
        name: generateAnonymousId(comment.user.id),
        image: "",
      };
    }
    return comment;
  });
  if (reviewData.isAnonymous) {
    reviewData.user = {
      name: generateAnonymousId(reviewData.userId),
      image: "",
    };
  }
  console.log(reviewData.comments);
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
