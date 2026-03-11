import { clsx } from "clsx";
import type { Category } from "../../data/categories";

type CatalogSidebarProps = {
  categories: { value: Category; label: string }[];
  brands: string[];
  activeCategory: Category | null;
  priceRange: [number, number];
  selectedBrands: string[];
  onCategoryChange: (category: Category) => void;
  onClearCategory: () => void;
  onPriceChange: (range: [number, number]) => void;
  onBrandToggle: (brand: string) => void;
  onClearFilters: () => void;
};

export function CatalogSidebar({
  categories,
  brands,
  activeCategory,
  priceRange,
  selectedBrands,
  onCategoryChange,
  onClearCategory,
  onPriceChange,
  onBrandToggle,
  onClearFilters,
}: CatalogSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 space-y-10">
      <div className="space-y-6">
        <h3 className="font-display font-bold text-xl">Categorias</h3>

        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={clsx(
                "text-sm text-left transition-colors hover:text-accent",
                activeCategory === cat.value
                  ? "text-accent font-bold"
                  : "text-zinc-400",
              )}
            >
              {cat.label}
            </button>
          ))}

          <button
            onClick={onClearCategory}
            className={clsx(
              "text-sm text-left transition-colors hover:text-accent",
              !activeCategory ? "text-accent font-bold" : "text-zinc-400",
            )}
          >
            Todas as Categorias
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-display font-bold text-xl">Preço</h3>

        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([0, parseInt(e.target.value, 10)])}
            className="w-full accent-accent"
          />

          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>R$ 0</span>
            <span>Até R$ {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-display font-bold text-xl">Marcas</h3>

        <div className="flex flex-col gap-3">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => onBrandToggle(brand)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-accent focus:ring-accent"
              />
              <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onClearFilters}
        className="w-full py-3 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 transition-colors"
      >
        Limpar Filtros
      </button>
    </aside>
  );
}