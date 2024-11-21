import ReviewLegacy from "@/components/review-legacy";
import prisma from "@/lib/prisma";
import { z } from "zod";
//
const QueryParamsSchema = z.object({
  company: z.string().optional(),
  contractType: z
    .enum(["INTERNSHIP", "CDI", "CDD", "FREELANCE", "OTHER"], {
      message: "Invalid Contract Type",
    })
    .optional(),
  jobSource: z
    .enum(
      [
        "FRIEND_REFERRAL",
        "LINKEDIN",
        "COMPANY_WEBSITE",
        "JOB_BOARD",
        "CAREER_FAIR",
        "OTHER",
      ],
      { message: "Invalid jobSource" },
    )
    .optional(),
  salaryRange: z
    .tuple([z.number().min(0).max(100000), z.number().min(0).max(100000)])
    .refine(([min, max]) => min <= max, {
      message: "Minimum salary must be less than or equal to maximum salary",
    })
    .optional(),
  rating: z
    .number({ errorMap: () => ({ message: "Invalid Rating Range" }) })
    .min(0)
    .max(5)
    .optional(),
});

type TQueryParams = z.infer<typeof QueryParamsSchema>;

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const validatedParams = QueryParamsSchema.safeParse({
    company: searchParams.company,
    contractType: searchParams.contractType,
    jobSource: searchParams.jobSource,
    salaryRange: searchParams.salaryRange,
    rating: searchParams.rating,
  });

  if (!validatedParams.success) {
    console.log(validatedParams.error);
  }

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
