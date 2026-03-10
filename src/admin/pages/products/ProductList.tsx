/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  AlertCircle,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { useProductStore } from "@/src/store/useProductStore";
import { Product } from "@/src/types";
import { DataTable } from "../../components/shared/DataTable";
import toast from "react-hot-toast";

export function ProductList() {
  const { products, isLoading, deleteProduct, toggleFeatured } =
    useProductStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "low-stock" ? p.stock < 5 : p.stock > 0);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const columns = [
    {
      header: "Produto",
      accessor: (p: Product) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="font-bold text-white">{p.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {p.brand}
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
                  : "text-zinc-300",
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
                : "bg-red-500/10 text-red-500",
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
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === p.id ? null : p.id);
            }}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <MoreVertical size={18} />
          </button>

          <AnimatePresence>
            {activeMenu === p.id && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setActiveMenu(null)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      navigate(`/admin/produtos/${p.id}`);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <Eye size={14} /> Visualizar
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/admin/produtos/${p.id}/editar`);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <Edit size={14} /> Editar
                  </button>
                  <button
                    onClick={async () => {
                      await toggleFeatured(p.id);

                      toast.success(
                        p.featured
                          ? "Produto removido dos destaques"
                          : "Produto destacado com sucesso",
                      );
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <Star size={14} />{" "}
                    {p.featured ? "Remover Destaque" : "Destacar"}
                  </button>
                  <div className="h-px bg-zinc-800" />
                  <button
                    onClick={async () => {
                      if (
                        confirm("Tem certeza que deseja excluir este produto?")
                      ) {
                        await deleteProduct(p.id);
                      }
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Filters & Search */}
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

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
        onRowClick={(p) => navigate(`/admin/produtos/${p.id}`)}
      />

      {/* Pagination Mock */}
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
