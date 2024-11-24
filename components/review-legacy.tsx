"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewWithCompany } from "@/lib/types";
import {
  Building2,
  // ChevronLeft,
  // ChevronRight,
  DollarSign,
  LoaderCircle,
  Star,
  XCircle,
} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useTransition } from "react";
import { formatSalary } from "./ReviewShowCase";
import { DualRangeSlider } from "./ui/dual-range-slider";
import { FancySwitch } from "@omit/react-fancy-switch";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ZodError } from "zod";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
// import { SkeletonReview } from "./SkeletonReview";
// import { Skeleton, SVGSkeleton } from "./ui/Skeleton";

const renderRatingStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
};

export default function ReviewLegacy({
  reviews,
  error,
}: {
  reviews: ReviewWithCompany[];
  error: ZodError["issues"];
}) {
  const [isLoading, startTransition] = useTransition();
  const [company, setCompany] = useQueryState(
    "company",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, throttleMs: 800, startTransition }),
  );
  const [contractType, setContractType] = useQueryState(
    "contractType",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, startTransition }),
  );
  const [jobSource, setJobSource] = useQueryState(
    "jobSource",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, startTransition }),
  );
  const [salaryRange, setSalaryRange] = useQueryState(
    "salaryRange",
    parseAsArrayOf(parseAsInteger, ",")
      .withDefault([0, 10000])
      .withOptions({ shallow: false, throttleMs: 800, startTransition }),
  );
  const [selectedRating, setSelectedRating] = useQueryState(
    "rating",
    parseAsInteger
      .withDefault(0)
      .withOptions({ shallow: false, startTransition }),
  );

  const [selectedOption, setSelectedOption] = useQueryState(
    "sort",
    parseAsString
      .withDefault("Recent")
      .withOptions({ shallow: false, startTransition }),
  );
  const handleRatingClick = (rating: number) => {
    // If clicking the same rating, reset to 0 (diselect)
    setSelectedRating(rating === selectedRating ? 0 : rating);
  };

  const handleReset = () => {
    setCompany("");
    setContractType("");
    setJobSource("");
    setSalaryRange([0, 10000]);
    setSelectedRating(0);
    setSelectedOption("Recent");
  };

  const options = ["Recent", "Oldest"];
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8">
      {/* <div className="max-w-[1024px]  px-4 py-8"> */}
      <h1 className="text-3xl font-bold mb-8">Internship Reviews</h1>
      <div className="flex gap-8">
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Filters
                {isLoading && <LoaderCircle className="size-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Search companies..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Contract Type</Label>
                <Select
                  value={contractType}
                  onValueChange={(value) => setContractType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Source</Label>
                <Select
                  value={jobSource}
                  onValueChange={(value) => setJobSource(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FRIEND_REFERRAL">
                      Friend Referral
                    </SelectItem>
                    <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                    <SelectItem value="COMPANY_WEBSITE">
                      Company Website
                    </SelectItem>
                    <SelectItem value="JOB_BOARD">Job Board</SelectItem>
                    <SelectItem value="CAREER_FAIR">Career Fair</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Salary Range</Label>
                <div className="px-2 ">
                  <DualRangeSlider
                    // label={(salaryRange) => salaryRange}
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    min={0}
                    max={10000}
                    step={100}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>${salaryRange[0]}</span>
                  <span>${salaryRange[1]}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <div className="flex items-center space-x-5">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant="ghost"
                      size="lg"
                      className="p-0 hover:bg-transparent"
                      onClick={() => {
                        setSelectedRating(rating), handleRatingClick(rating);
                      }}
                    >
                      <Star
                        className={`w-12 h-12 ${
                          rating <= selectedRating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              </div>
              <FancySwitch
                options={options}
                value={selectedOption}
                onChange={setSelectedOption}
                className="flex rounded-full bg-muted p-2"
                highlighterClassName="bg-primary rounded-full"
                aria-label="Order type"
                radioClassName={cn(
                  "relative flex h-7 cursor-pointer items-center justify-center",
                  "flex-1 px-4 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "data-[checked]:text-primary-foreground",
                  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                )}
                highlighterIncludeMargin={true}
              />
              <Button className="w-full" onClick={handleReset}>
                Reset
              </Button>
            </CardContent>
          </Card>
        </aside>
        <main className="flex flex-col space-y-8 overflow-hidden w-full">
          {/* {isLoading && (
                  // <SkeletonReview />
              <Card key={1}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <SVGSkeleton className="w-[48px] h-[48px]" />
                  <div>
                    <h2 className="text-2xl font-semibold">
                    <Skeleton className="w-[56px] max-w-full" />

                    </h2>
                    <Skeleton className="w-[100px] max-w-full" />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <SVGSkeleton className="text-orange-200 fill-orange-200 w-[24px] h-[24px]" />
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                  <Skeleton className="w-[80px] max-w-full" />
                  <Skeleton className="w-[64px] max-w-full" />
                  <span className="flex items-center">
                    <Skeleton className="w-[100px] max-w-full" />
                  </span>
                </div>
                <p className="mt-4">
                  <Skeleton className="w-[488px] max-w-full" />
                  <Skeleton className="w-[488px] max-w-full" />
                </p>
              </CardContent>
            </Card>
          )}  */}
          {error.length > 0 && (
            <Alert variant="default">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Invalid Sort Parameter</AlertTitle>
              {error.map((err, key) => (
                <AlertDescription key={key} className="mt-2">
                  {err.message}
                </AlertDescription>
              ))}
            </Alert>
          )}
          {!error.length && reviews.length === 0 && (
            <p className="flex items-center justify-center mb-1">
              No review found
            </p>
          )}
          {reviews.map((review, key) => (
            <Card key={key}>
              <Link
                href={`/review/${review.slug}`}
                key={key}
                // target="_blank"
                prefetch={true}
                className="flex flex-col"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Building2 className="min-w-12 min-h-12 text-primary" />
                    <div className="max-w-full">
                      <h2 className="text-2xl font-semibold max-w-full">
                        {review.company.name}
                      </h2>
                      <p className="text-muted-foreground overflow-auto max-h-14">
                        {review.jobTitle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    {renderRatingStars(review.rating)}
                  </div>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{review.contractType}</span>
                    <span>{review.jobSource}</span>
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {review.salaryType == "EXACT"
                        ? `$${review.exactSalary}`
                        : formatSalary(
                            review.salaryRangeMin!,
                            review.salaryRangeMax!,
                          )}
                    </span>
                  </div>
                  <p className="overflow-ellipsis overflow-hidden mt-4">
                    {review.description.length > 200
                      ? `${review.description.substring(0, 200)}...`
                      : review.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
          {/* <div className="flex justify-center items-center space-x-2 mt-8"> */}
          {/* <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button> */}
          {/* {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="icon"
              >
                {page}
              </Button>
            ))} */}
          {/* <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button> */}
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}
