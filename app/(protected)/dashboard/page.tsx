import ReviewLegacy from "@/components/review-legacy";
import prisma from "@/lib/prisma";
import { z } from "zod";

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
  salaryRange: z.preprocess(
    (val) => {
      // If val is undefined or null, return undefined
      if (val == null) return undefined;

      // If it's already an array, return as is
      if (Array.isArray(val)) return val;

      // If it's a string, split and convert to numbers
      if (typeof val === "string") {
        const parsed = val.split(",").map(Number);
        return parsed.length === 2 && !parsed.some(isNaN) ? parsed : undefined;
      }

      return undefined;
    },
    z
      .array(z.number().min(0).max(100000))
      .length(2, { message: "Salary range must be exactly two numbers" })
      .refine(([min, max]) => min <= max, {
        message: "Minimum salary must be less than or equal to maximum salary",
      })
      .optional(),
  ),
  rating: z.coerce
    .number({ errorMap: () => ({ message: "Invalid Rating Range" }) })
    .min(0)
    .max(5)
    .optional(),
  sort: z.enum(["Recent", "Oldest"], { message: "Invalid Sort" }).optional(),
});

// type TQueryParams = z.infer<typeof QueryParamsSchema>;

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
    sort: searchParams.sort,
  });

  if (!validatedParams.success) {
    // console.log(validatedParams.error.issues);
    // return <pre>{JSON.stringify(validatedParams.error)}</pre>;
    return <ReviewLegacy reviews={[]} error={validatedParams.error.issues} />;
  }
  // console.log(validatedParams.data);

  const data = await prisma.review.findMany({
    where: {
      ...(validatedParams.data.company && {
        company: {
          name: { contains: validatedParams.data.company, mode: "insensitive" },
        },
      }),
      ...(validatedParams.data.contractType && {
        contractType: validatedParams.data.contractType,
      }),
      ...(validatedParams.data.jobSource && {
        jobSource: validatedParams.data.jobSource,
      }),
      ...(validatedParams.data.rating && {
        rating: validatedParams.data.rating,
      }),
      ...(validatedParams.data.salaryRange && {
        OR: [
          // Match exact salaries within the range
          {
            salaryType: "EXACT",
            exactSalary: {
              gte: validatedParams.data.salaryRange[0],
              lte: validatedParams.data.salaryRange[1],
            },
          },
          {
            salaryType: "RANGE",
            AND: [
              {
                salaryRangeMin: {
                  lte: validatedParams.data.salaryRange[1],
                },
              },
              {
                salaryRangeMax: {
                  gte: validatedParams.data.salaryRange[0],
                },
              },
            ],
          },
        ],
      }),
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: validatedParams.data.sort === "Oldest" ? "asc" : "desc",
    },
  });
  // console.log(data);
  // get the reviews from db since we are on the server and pass them to the Reviews component
  return (
    <>
      <ReviewLegacy reviews={data} error={[]} />
    </>
  );
}
