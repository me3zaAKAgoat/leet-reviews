// import { cn } from "@/lib/utils"

// function Skeleton({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLDivElement>) {
//   return (
//     <div
//       className={cn("animate-pulse rounded-md bg-muted", className)}
//       {...props}
//     />
//   )
// }

const Skeleton = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div aria-live="polite" aria-busy="true" className={className}>
    <span className="inline-flex w-full animate-pulse select-none rounded-md bg-[#eae0ab] leading-none">
      ‌
    </span>
    <br />
  </div>
);

const SVGSkeleton = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <svg className={className + " animate-pulse rounded bg-[#eae0ab]"} />
);

export { Skeleton, SVGSkeleton };
