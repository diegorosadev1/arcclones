import { AnimatePresence } from "motion/react";
import { ProductCard } from "../ProductCard";
import { CatalogEmptyState } from "./CatalogEmptyState";
import { CatalogGridSkeleton } from "../skeletons/CatalogGridSkeleton";
import type { Product } from "../../types";

type CatalogGridProps = {
  products: Product[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  onClearFilters: () => void;
};

export function CatalogGrid({
  products,
  isLoading,
  viewMode,
  onClearFilters,
}: CatalogGridProps) {
  if (isLoading) {
    return <CatalogGridSkeleton count={6} />;
  }

  if (products.length === 0) {
    return <CatalogEmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
          : "grid grid-cols-1 gap-6"
      }
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatePresence>
    </div>
  );
}