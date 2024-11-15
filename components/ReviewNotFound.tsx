import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function ReviewNotFound({ reviewId }: { reviewId: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <FileQuestion className="mx-auto h-24 w-24 " aria-hidden="true" />
          <h2 className="mt-6 text-3xl font-extrabold ">Review Not Found</h2>
          <p className="mt-2 text-sm ">
            We couldn&apos;t find a review with the ID
            <span className="font-medium">{reviewId}</span>
          </p>
        </div>
        <div className="mt-8">
          <p className="text-sm ">
            The review you&apos;re looking for might have been removed or
            doesn&apos;t exist.
          </p>
        </div>
        <div className="mt-6">
          <Link href="/dashboard" passHref>
            <Button className="w-full">Go back to Reviews</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
