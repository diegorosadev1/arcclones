import { Skeleton } from "../ui/Skeleton";

export function CategoryCardSkeleton() {
  return (
    <div className="relative h-80 rounded-2xl overflow-hidden border border-zinc-800">
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      <div className="absolute bottom-6 left-6 space-y-3">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}