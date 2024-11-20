import ReviewLegacy from "@/components/review-legacy";
import Reviews from "@/components/reviews";
import prisma from "@/lib/prisma";

export default async function Layout() {
  const data = await prisma.review.findMany({
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  // console.log(data);
  // get the reviews from db since we are on the server and pass them to the Reviews component
  return (
    <>
      <ReviewLegacy reviews={data} />
    </>
  );
}
