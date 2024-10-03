"use client";
// import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { Button } from "@/components/ui/button";

export default function ReviewCard({
  Review,
}: {
  Review: {
    company: {
      name: string;
      location: string;
      image: string;
    };
    review: {
      rating: number;
      description: string;
      createdAt: string;
    };
  };
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border border-stone-500 rounded-sm">
      <div className="flex sm:flex-col gap-4">
        <img
          src={Review.company.image}
          width={80}
          height={80}
          alt={Review.company.name}
        />
        <div>
          <h1>{Review.company.name}</h1>
          <h2>{Review.company.location}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Rating
          SVGstyle={{ display: "inline", height: "15px", width: "15px" }}
          readonly
          initialValue={Review.review.rating}
        />
        <p>{Review.review.description}</p>
        <div className="flex items-end justify-between">
          <p className="text-xs">created at: {Review.review.createdAt}</p>
          <Button>Expand</Button>
        </div>
      </div>
    </div>
  );
}
