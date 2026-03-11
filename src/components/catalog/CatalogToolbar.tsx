import { ChevronDown, Filter, LayoutGrid, List, Search } from "lucide-react";
import { clsx } from "clsx";

type CatalogToolbarProps = {
  searchQuery: string;
  sortBy: string;
  viewMode: "grid" | "list";
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onOpenFilters: () => void;
};

export function CatalogToolbar({
  searchQuery,
  sortBy,
  viewMode,
  onSearchChange,
  onSortChange,
  onViewModeChange,
  onOpenFilters,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-luxury-card p-4 rounded-2xl border border-zinc-800">
      <div className="relative w-full sm:w-64">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <button
          onClick={onOpenFilters}
          className="lg:hidden p-2 text-zinc-400 hover:text-white"
          aria-label="Abrir filtros"
        >
          <Filter size={18} />
        </button>

        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="hidden sm:inline">Ordenar por:</span>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-zinc-900 text-white border border-zinc-800 rounded-lg pl-3 pr-10 py-2 font-bold cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="relevant" className="bg-zinc-900 text-white">
                Relevância
              </option>
              <option value="price-low" className="bg-zinc-900 text-white">
                Menor Preço
              </option>
              <option value="price-high" className="bg-zinc-900 text-white">
                Maior Preço
              </option>
              <option value="rating" className="bg-zinc-900 text-white">
                Melhor Avaliação
              </option>
              <option value="newest" className="bg-zinc-900 text-white">
                Lançamentos
              </option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
          </div>
        </div>

        <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewModeChange("grid")}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              viewMode === "grid"
                ? "text-accent bg-accent/10"
                : "text-zinc-500 hover:text-zinc-300",
            )}
            aria-label="Visualização em grade"
          >
            <LayoutGrid size={20} />
          </button>

          <button
            onClick={() => onViewModeChange("list")}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              viewMode === "list"
                ? "text-accent bg-accent/10"
                : "text-zinc-500 hover:text-zinc-300",
            )}
            aria-label="Visualização em lista"
          >
            <List size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
