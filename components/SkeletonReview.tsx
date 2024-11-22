import { Skeleton, SVGSkeleton } from "@/components/ui/Skeleton";

const LoadingSkeleton = () => (
  <>
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <SVGSkeleton className="w-[48px] h-[48px]" />
        <div>
          <h2>
            <Skeleton className="w-[56px] max-w-full" />
          </h2>
          <p>
            <Skeleton className="w-[100px] max-w-full" />
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <SVGSkeleton className="text-yellow-400 fill-yellow-400 w-[24px] h-[24px]" />
        <SVGSkeleton className="text-yellow-400 fill-yellow-400 w-[24px] h-[24px]" />
        <SVGSkeleton className="text-yellow-400 fill-yellow-400 w-[24px] h-[24px]" />
        <SVGSkeleton className="text-yellow-400 fill-yellow-400 w-[24px] h-[24px]" />
        <SVGSkeleton className="text-yellow-400 fill-yellow-400 w-[24px] h-[24px]" />
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <span>
          <Skeleton className="w-[80px] max-w-full" />
        </span>
        <span>
          <Skeleton className="w-[64px] max-w-full" />
        </span>
        <span className="flex items-center">
          <Skeleton className="w-[100px] max-w-full" />
          {/* <SVGSkeleton className="mr-1 w-[24px] h-[24px]" /> */}
        </span>
      </div>
      <p className="mt-4">
        <Skeleton className="w-[488px] max-w-full" />
        <Skeleton className="w-[488px] max-w-full" />
      </p>
    </div>
  </>
);

export const SkeletonReview = () => (
  <div className="flex justify-center w-full h-full p-10">
    <LoadingSkeleton />
  </div>
);
