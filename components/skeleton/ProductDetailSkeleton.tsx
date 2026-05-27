import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Skeleton className="mb-6 h-9 w-32 bg-white/5" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <Skeleton className="aspect-square rounded-xl bg-white/5 sm:aspect-4/3" />
        <div className="space-y-5">
          <Skeleton className="h-4 w-24 bg-white/5" />
          <Skeleton className="h-10 w-full max-w-md bg-white/5" />
          <Skeleton className="h-6 w-40 bg-white/5" />
          <Skeleton className="h-24 w-full rounded-xl bg-white/5" />
          <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
        </div>
      </div>
    </div>
  );
}
