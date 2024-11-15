"use client";

import { format } from "date-fns";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ReviewWithCompany } from "@/lib/types";

const formatSalary = (min: number, max: number) => {
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
};

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

export default function ReviewShowCase({
  reviewData,
}: {
  reviewData: ReviewWithCompany;
}) {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">
              {reviewData.jobTitle}
            </CardTitle>
            <p className="text-muted-foreground">{reviewData.company.name}</p>
          </div>
          <Badge
            variant={reviewData.wouldRecommend ? "default" : "destructive"}
            className="text-sm font-medium"
          >
            {reviewData.wouldRecommend ? (
              <ThumbsUp className="w-4 h-4 mr-1" />
            ) : (
              <ThumbsDown className="w-4 h-4 mr-1" />
            )}
            {reviewData.wouldRecommend ? "Recommended" : "Not Recommended"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{reviewData.contractType}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{reviewData.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>
              {format(reviewData.startDate, "MMM yyyy")} -{" "}
              {reviewData.endDate
                ? format(reviewData.endDate, "MMM yyyy")
                : "Present"}
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>
              {reviewData.salaryType == "EXACT"
                ? `$${reviewData.exactSalary}`
                : formatSalary(
                    reviewData.salaryRangeMin!,
                    reviewData.salaryRangeMax!,
                  )}
            </span>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2 text-lg">Overall Rating</h3>
          <div className="flex items-center">
            {renderRatingStars(reviewData.rating)}
            <span className="ml-2 text-muted-foreground">
              {reviewData.rating}/5
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-lg">Interview Difficulty</h3>
          <Progress
            value={reviewData.interviewDifficulty! * 20}
            className="w-full"
          />
          {/* by default its 3 so it cannot be null but i should fix it later */}
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Easy</span>
            <span>Moderate</span>
            <span>Difficult</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-lg">Application Process</h3>
          {reviewData.applicationDate && (
            <div className="flex items-center mb-2 text-sm">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>
                Applied on {format(reviewData.applicationDate!, "MMMM d, yyyy")}
              </span>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {reviewData.interviewProcess}
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2 text-lg">Review</h3>
          <p className="text-sm leading-relaxed">{reviewData.description}</p>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>
              Job found via:{" "}
              {reviewData.jobSource.replace("_", " ").toLowerCase()}
            </span>
          </div>
          {reviewData.isAnonymous && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>This review was posted anonymously</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
