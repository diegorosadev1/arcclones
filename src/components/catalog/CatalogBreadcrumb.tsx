import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Category } from "../../data/categories";

type CatalogBreadcrumbProps = {
  activeCategory: Category | null;
};

const categoryLabels: Record<Category, string> = {
  Watches: "Relógios",
  "Shoulder Bags": "Bolsas",
  Glasses: "Óculos",
  Jewelry: "Joias",
};

export function CatalogBreadcrumb({
  activeCategory,
}: CatalogBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest mb-8">
      <Link to="/" className="hover:text-accent transition-colors">
        Início
      </Link>

      <ChevronRight size={12} />

      <span className="text-zinc-300">Catálogo</span>

      {activeCategory && (
        <>
          <ChevronRight size={12} />
          <span className="text-accent">
            {categoryLabels[activeCategory]}
          </span>
        </>
      )}
    </nav>
  );
}