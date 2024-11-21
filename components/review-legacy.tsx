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
import { Slider } from "@/components/ui/slider";
import { ReviewWithCompany } from "@/lib/types";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Star,
} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useTransition } from "react";
import { formatSalary } from "./ReviewShowCase";

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
}: {
  reviews: ReviewWithCompany[];
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Internship Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
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
                <div className="px-2">
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    max={10000}
                    step={100}
                    className="mt-2"
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
                      onClick={() => setSelectedRating(rating)}
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
              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </aside>
        <main className="space-y-6">
          {isLoading && <p>Loading...</p>}
          {reviews.map((review, key) => (
            <Card key={key}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Building2 className="w-12 h-12 text-primary" />
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {review.company.name}
                    </h2>
                    <p className="text-muted-foreground">{review.jobTitle}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  {renderRatingStars(review.rating)}
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Internship</span>
                  <span>LinkedIn</span>
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
                <p className="mt-4">
                  {review.description.length > 200
                    ? `${review.description.substring(0, 200)}...`
                    : review.description}
                </p>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="icon"
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
