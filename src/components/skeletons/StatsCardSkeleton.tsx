import { Skeleton } from "../ui/Skeleton";

export function StatsCardSkeleton() {
  return (
    <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}