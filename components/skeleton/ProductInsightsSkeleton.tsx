import { Skeleton } from "@/components/ui/skeleton";

export function ProductInsightsSkeleton() {
  return (
    <div className="space-y-3 px-6 py-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full bg-white/5" />
      ))}
    </div>
  );
}
