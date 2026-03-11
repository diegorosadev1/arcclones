import { Skeleton } from "../ui/Skeleton";

export function CatalogToolbarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-luxury-card p-4 rounded-2xl border border-zinc-800">
      <Skeleton className="h-11 w-full sm:w-64 rounded-full" />

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-6 w-px rounded-none" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}