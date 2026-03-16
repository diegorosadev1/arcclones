import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { useProductStore } from "../../../../store/useProductStore";
import { Link, useNavigate } from "react-router-dom";
import { useProductColumns } from "../hooks/useProductColumns";
import { DataTable } from "@/src/admin/components/shared/DataTable";

export function ProductList() {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    deleteProduct,
    toggleFeatured,
  } = useProductStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    return safeProducts.filter((p) => {
      const stock = p?.stock || 0;

      const matchesSearch =
        (p?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (p?.sku?.toLowerCase() || "").includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || p?.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "low-stock"
            ? stock > 0 && stock < 5
            : statusFilter === "out-of-stock"
              ? stock === 0
              : statusFilter === "active"
                ? stock > 0
                : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const columns = useProductColumns({
    activeMenu,
    setActiveMenu,
    onView: (id) => navigate(`/admin/produtos/${id}`),
    onEdit: (id) => navigate(`/admin/produtos/${id}/editar`),
    onToggleFeatured: async (id) => {
      await toggleFeatured(id);
    },
    onDelete: async (id) => {
      if (confirm("Tem certeza que deseja excluir este produto?")) {
        await deleteProduct(id);
      }
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Produtos</h1>
          <p className="text-zinc-500 text-sm">
            Gerencie o catálogo de itens da sua loja.
          </p>
        </div>

        <Link
          to="/admin/produtos/novo"
          className="btn-primary px-8 py-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <Plus size={20} /> Novo Produto
        </Link>
      </div>

      <div className="glass-card p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="relative w-full lg:w-96">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors text-zinc-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
            <Filter size={16} className="text-zinc-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-zinc-300 cursor-pointer"
            >
              <option value="all">Todas Categorias</option>
              <option value="Watches">Relógios</option>
              <option value="Shoulder Bags">Bolsas</option>
              <option value="Glasses">Óculos</option>
              <option value="Jewelry">Joias</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-zinc-300 cursor-pointer"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativos</option>
              <option value="low-stock">Estoque Baixo</option>
              <option value="out-of-stock">Esgotados</option>
            </select>
          </div>

          <div className="h-8 w-px bg-zinc-800 hidden lg:block" />

          <div className="flex items-center gap-2">
            <button className="p-2 text-accent bg-accent/10 rounded-lg">
              <LayoutGrid size={20} />
            </button>
            <button className="p-2 text-zinc-500 hover:text-zinc-300">
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
      />

      <div className="flex items-center justify-between text-zinc-500">
        <p className="text-xs font-bold uppercase tracking-widest">
          Mostrando {filteredProducts.length} de {products.length} produtos
        </p>

        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors disabled:opacity-30"
            disabled
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-bold text-white">Página 1 de 1</span>
          <button
            className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors disabled:opacity-30"
            disabled
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}