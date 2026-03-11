import { ProductCardSkeleton } from "./ProductCardSkeleton";

type CatalogGridSkeletonProps = {
  count?: number;
};

export function CatalogGridSkeleton({
  count = 6,
}: CatalogGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}