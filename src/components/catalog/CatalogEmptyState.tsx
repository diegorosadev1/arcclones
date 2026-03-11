import { Search } from "lucide-react";

type CatalogEmptyStateProps = {
  onClearFilters: () => void;
};

export function CatalogEmptyState({
  onClearFilters,
}: CatalogEmptyStateProps) {
  return (
    <div className="text-center py-24 space-y-6">
      <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700">
        <Search size={40} />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold">
          Nenhum produto encontrado
        </h3>
        <p className="text-zinc-500">
          Tente ajustar seus filtros ou buscar por outro termo.
        </p>
      </div>

      <button onClick={onClearFilters} className="btn-primary">
        Limpar Todos os Filtros
      </button>
    </div>
  );
}