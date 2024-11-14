import ReviewShowCase from "@/components/ReviewShowCase";
import prisma from "@/lib/prisma";

export default async function ReviewShowcase({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  // return <div>My Post: {slug}</div>
  const reviewData = await prisma.review.findUnique({
    where: {
      slug: slug,
    },
    include: {
      company: true,
    },
  });

  if (!reviewData) {
    return <div>Review Not found</div>;
  }
  console.log(reviewData);
  return <ReviewShowCase reviewData={reviewData} />;
}
