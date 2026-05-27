import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-36 bg-white/5" />
        <Skeleton className="h-5 w-56 bg-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[92px] rounded-lg bg-white/5" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-lg bg-white/5 lg:col-span-2" />
        <Skeleton className="h-80 rounded-lg bg-white/5" />
      </div>
      <Skeleton className="h-96 rounded-lg bg-white/5" />
    </div>
  );
}
