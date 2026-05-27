import { Skeleton } from "@/components/ui/skeleton";

export function ProductsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/6">
      <Skeleton className="h-10 w-full rounded-none bg-white/5" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-none bg-white/3" />
      ))}
    </div>
  );
}
