import { Skeleton } from "../ui/Skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-8" />
        </div>

        <Skeleton className="h-6 w-4/5" />

        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}