import { AlertCircle, Star } from "lucide-react";
import { clsx } from "clsx";
import type { Product } from "../../../../types";
import { ProductActionsMenu } from "../components/ProductActionsMenu";

interface UseProductColumnsProps {
  activeMenu: string | null;
  setActiveMenu: (value: string | null) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleFeatured: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function useProductColumns({
  activeMenu,
  setActiveMenu,
  onView,
  onEdit,
  onToggleFeatured,
  onDelete,
}: UseProductColumnsProps) {
  return [
    {
      header: "Produto",
      accessor: (p: Product) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <img
              src={p?.images?.[0] || "https://picsum.photos/seed/luxury/100/100"}
              alt={p?.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="font-bold text-white">{p?.name || "Sem Nome"}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {p?.brand || "Sem Marca"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Categoria",
      accessor: (p: Product) => (
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          {p.category}
        </span>
      ),
    },
    {
      header: "SKU",
      accessor: (p: Product) => (
        <span className="text-xs font-mono text-zinc-500">{p.sku}</span>
      ),
    },
    {
      header: "Preço",
      accessor: (p: Product) => (
        <div className="space-y-1">
          <p className="font-bold text-white">
            R$ {p.price.toLocaleString("pt-BR")}
          </p>
          {p.promoPrice && (
            <p className="text-[10px] text-emerald-500 font-bold">
              Promo: R$ {p.promoPrice.toLocaleString("pt-BR")}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Estoque",
      accessor: (p: Product) => (
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "text-xs font-bold",
              p.stock === 0
                ? "text-red-500"
                : p.stock < 5
                  ? "text-amber-500"
                  : "text-zinc-300"
            )}
          >
            {p.stock} un.
          </span>
          {p.stock < 5 && <AlertCircle size={12} className="text-amber-500" />}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (p: Product) => (
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
              p.stock > 0
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
            )}
          >
            {p.stock > 0 ? "Ativo" : "Esgotado"}
          </span>
          {p.featured && (
            <Star size={12} className="text-amber-400 fill-amber-400" />
          )}
        </div>
      ),
    },
    {
      header: "Ações",
      accessor: (p: Product) => (
        <ProductActionsMenu
          productId={p.id}
          featured={p.featured}
          isOpen={activeMenu === p.id}
          onToggle={() => setActiveMenu(activeMenu === p.id ? null : p.id)}
          onClose={() => setActiveMenu(null)}
          onView={() => onView(p.id)}
          onEdit={() => onEdit(p.id)}
          onToggleFeatured={() => onToggleFeatured(p.id)}
          onDelete={() => onDelete(p.id)}
        />
      ),
    },
  ];
}