import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import type { Category } from "../data/categories";

import { catalogBrands, catalogCategories } from "../data/catalog";

import { CatalogBreadcrumb } from "../components/catalog/CatalogBreadcrumb";
import { CatalogSidebar } from "../components/catalog/CatalogSidebar";
import { CatalogToolbar } from "../components/catalog/CatalogToolbar";
import { CatalogActiveFilters } from "../components/catalog/CatalogActiveFilters";
import { CatalogGrid } from "../components/catalog/CatalogGrid";

import { CatalogFiltersSkeleton } from "../components/skeletons/CatalogFiltersSkeleton";
import { CatalogToolbarSkeleton } from "../components/skeletons/CatalogToolbarSkeleton";

export function Catalog() {
  const { products, isLoading, fetchProducts } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortBy, setSortBy] = useState("relevant");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeCategory = searchParams.get("category") as Category | null;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price),
        );
        break;
      case "price-high":
        result.sort(
          (a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price),
        );
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (a.newArrival ? -1 : 1));
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, selectedBrands, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery("");
    setPriceRange([0, 5000]);
    setSortBy("relevant");
    setSelectedBrands([]);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand],
    );
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <CatalogBreadcrumb activeCategory={activeCategory} />

      <div className="flex flex-col lg:flex-row gap-12">
        {isLoading ? (
          <CatalogFiltersSkeleton />
        ) : (
          <CatalogSidebar
            categories={catalogCategories}
            brands={catalogBrands}
            activeCategory={activeCategory}
            priceRange={priceRange}
            selectedBrands={selectedBrands}
            onCategoryChange={(category) => setSearchParams({ category })}
            onClearCategory={() => setSearchParams({})}
            onPriceChange={setPriceRange}
            onBrandToggle={toggleBrand}
            onClearFilters={clearFilters}
          />
        )}

        <div className="flex-grow space-y-8">
          {isLoading ? (
            <CatalogToolbarSkeleton />
          ) : (
            <CatalogToolbar
              searchQuery={searchQuery}
              sortBy={sortBy}
              viewMode={viewMode}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              onViewModeChange={setViewMode}
              onOpenFilters={() => setIsFilterOpen(true)}
            />
          )}

          <CatalogActiveFilters
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            priceRange={priceRange}
            total={filteredProducts.length}
            onClearCategory={() => setSearchParams({})}
            onClearSearch={() => setSearchQuery("")}
            onResetPrice={() => setPriceRange([0, 5000])}
          />

          <CatalogGrid
            products={filteredProducts}
            isLoading={isLoading}
            viewMode={viewMode}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  );
}