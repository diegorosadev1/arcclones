import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";

import { HeroSection } from "../components/home/sections/HeroSection";
import { CategoriesSection } from "../components/home/sections/CategoriesSection";
import { FeaturedProductsSection } from "../components/home/sections/FeaturedProductsSection";
import { BenefitsSection } from "../components/home/sections/BenefitsSection";
import { BestSellersSection } from "../components/home/sections/BestSellersSection";
import { NewArrivalsSection } from "../components/home/sections/NewArrivalsSection";
import { TestimonialsSection } from "../components/home/sections/TestimonialsSection";

export function Home() {
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);

  return (
    <div className="space-y-24 pb-24">
      <HeroSection />
      <CategoriesSection />

      <FeaturedProductsSection
        products={featuredProducts}
        isLoading={isLoading}
      />

      <BenefitsSection />

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <BestSellersSection products={bestSellers} isLoading={isLoading} />
        <NewArrivalsSection products={newArrivals} isLoading={isLoading} />
      </section>

      <TestimonialsSection />
    </div>
  );
}