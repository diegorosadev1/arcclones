import { Link } from "react-router-dom";
import { ProductCard } from "../../ProductCard";
import { ProductCardSkeleton } from "../../skeletons/ProductCardSkeleton";
import type { Product } from "../../../types";

type NewArrivalsSectionProps = {
  products: Product[];
  isLoading: boolean;
};

export function NewArrivalsSection({
  products,
  isLoading,
}: NewArrivalsSectionProps) {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold">Lançamentos</h2>
        <Link
          to="/catalog"
          className="text-accent text-sm font-bold hover:underline"
        >
          Ver Mais
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
}