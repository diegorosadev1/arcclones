import { X } from "lucide-react";
import type { Category } from "../../data/categories";

type CatalogActiveFiltersProps = {
  activeCategory: Category | null;
  searchQuery: string;
  priceRange: [number, number];
  total: number;
  onClearCategory: () => void;
  onClearSearch: () => void;
  onResetPrice: () => void;
};

const categoryLabels: Record<Category, string> = {
  Watches: "Relógios",
  "Shoulder Bags": "Bolsas",
  Glasses: "Óculos",
  Jewelry: "Joias",
};

export function CatalogActiveFilters({
  activeCategory,
  searchQuery,
  priceRange,
  total,
  onClearCategory,
  onClearSearch,
  onResetPrice,
}: CatalogActiveFiltersProps) {
  const hasFilters =
    Boolean(activeCategory) || Boolean(searchQuery) || priceRange[1] < 5000;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeCategory && (
        <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs flex items-center gap-2">
          Categoria: {categoryLabels[activeCategory]}
          <button onClick={onClearCategory}>
            <X size={12} />
          </button>
        </span>
      )}

      {searchQuery && (
        <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs flex items-center gap-2">
          Busca: {searchQuery}
          <button onClick={onClearSearch}>
            <X size={12} />
          </button>
        </span>
      )}

      {priceRange[1] < 5000 && (
        <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs flex items-center gap-2">
          Até R$ {priceRange[1].toLocaleString()}
          <button onClick={onResetPrice}>
            <X size={12} />
          </button>
        </span>
      )}

      <p className="text-xs text-zinc-500 ml-auto self-center">
        Mostrando <span className="text-white font-bold">{total}</span> produtos
      </p>
    </div>
  );
}