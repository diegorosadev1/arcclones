import { Skeleton } from "../ui/Skeleton";

export function CatalogFiltersSkeleton() {
  return (
    <aside className="hidden lg:block w-64 space-y-10">
      <div className="space-y-6">
        <Skeleton className="h-7 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-32" />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-7 w-20" />
        <div className="space-y-4">
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-7 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />
    </aside>
  );
}
