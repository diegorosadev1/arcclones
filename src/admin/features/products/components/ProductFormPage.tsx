import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, X, Trash2, Edit } from "lucide-react";
import { Product } from "../../../../types";

interface ProductFormPageProps {
  title: string;
  description?: string;
  tag?: string;
  mode: "view" | "edit" | "create";
  product?: Product;
  isLoading?: boolean;
  error?: string | null;
  notFound?: boolean;
  isUploading?: boolean;
  onSave?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  children: React.ReactNode;
}

export function ProductFormPage({
  title,
  description,
  tag,
  mode,
  product,
  isLoading,
  error,
  notFound,
  isUploading,
  onSave,
  onDelete,
  onBack,
  children,
}: ProductFormPageProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();
    navigate("/admin/produtos");
  };

  if (mode !== "create" && isLoading && !product) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-2xl font-display font-bold">Carregando produto...</h2>
        <p className="text-zinc-500 text-sm">Aguarde enquanto buscamos os dados.</p>
      </div>
    );
  }

  if (mode !== "create" && (notFound || (!product && error))) {
    return (
      <div className="text-center py-24 space-y-6">
        <h2 className="text-3xl font-display font-bold">Produto não encontrado</h2>
        <p className="text-zinc-500 text-sm">
          {error || "Não foi possível localizar este produto."}
        </p>
        <Link to="/admin/produtos" className="btn-primary inline-flex">
          Voltar para a Lista
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold">{title}</h1>

            {description && (
              <p className="text-zinc-500 text-sm">{description}</p>
            )}

            {tag && (
              <span className="inline-flex rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                {tag}
              </span>
            )}

            {isUploading && (
              <p className="text-xs text-amber-400">Enviando imagem...</p>
            )}
          </div>
        </div>

        {mode === "view" ? (
          <div className="flex items-center gap-4">
            <button
              onClick={onDelete}
              className="p-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-colors"
            >
              <Trash2 size={20} />
            </button>

            <button
              onClick={() => navigate(`/admin/produtos/${product?.id}/editar`)}
              className="btn-outline px-8 py-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <Edit size={20} />
              Editar Produto
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-4 rounded-xl border border-zinc-800 text-zinc-500 hover:bg-zinc-900 transition-colors"
            >
              <X size={20} />
            </button>

            <button
              onClick={onSave}
              disabled={isUploading}
              className="btn-primary px-8 py-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {mode === "create" ? "Criar Produto" : "Salvar Alterações"}
            </button>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}