import { Link } from "react-router-dom";
import { ProductCard } from "../../ProductCard";
import { ProductCardSkeleton } from "../../skeletons/ProductCardSkeleton";
import type { Product } from "../../../types";

type FeaturedProductsSectionProps = {
  products: Product[];
  isLoading: boolean;
};

export function FeaturedProductsSection({
  products,
  isLoading,
}: FeaturedProductsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Destaques da Semana
          </h2>
          <p className="text-zinc-500">
            Os itens mais desejados da nossa coleção.
          </p>
        </div>

        <Link to="/catalog" className="btn-outline">
          Ver Todos os Produtos
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}