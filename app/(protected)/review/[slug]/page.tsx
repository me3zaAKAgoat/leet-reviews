import CommentSection from "@/components/CommentSection";
import ReviewShowCase from "@/components/ReviewShowCase";
import prisma from "@/lib/prisma";

export default async function ReviewShowcase({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const reviewData = await prisma.review.findUnique({
    where: {
      slug: slug,
    },
    include: {
      company: true,
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!reviewData) {
    return <div>Review Not found</div>;
  }
  console.log(reviewData);
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