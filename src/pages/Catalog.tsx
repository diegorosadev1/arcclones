/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, LayoutGrid, List, Search, X, ChevronRight } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/ProductCard';
import { Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

export function Catalog() {
  const { products } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevant');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  const activeCategory = searchParams.get('category') as Category | null;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (a.newArrival ? -1 : 1));
        break;
    }

    return result;
  }, [activeCategory, searchQuery, priceRange, sortBy]);

  const categories: Category[] = ['Watches', 'Shoulder Bags', 'Glasses', 'Jewelry'];

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setPriceRange([0, 5000]);
    setSortBy('relevant');
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest mb-8">
        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-zinc-300">Catálogo</span>
        {activeCategory && (
          <>
            <ChevronRight size={12} />
            <span className="text-accent">{activeCategory}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 space-y-10">
          <div className="space-y-6">
            <h3 className="font-display font-bold text-xl">Categorias</h3>
            <div className="flex flex-col gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSearchParams({ category: cat })}
                  className={clsx(
                    "text-sm text-left transition-colors hover:text-accent",
                    activeCategory === cat ? "text-accent font-bold" : "text-zinc-400"
                  )}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setSearchParams({})}
                className={clsx(
                  "text-sm text-left transition-colors hover:text-accent",
                  !activeCategory ? "text-accent font-bold" : "text-zinc-400"
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
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
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
              {['Onyx', 'Celestial', 'Diver', 'Aura', 'Horizon', 'Lumina'].map(brand => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-accent focus:ring-accent" />
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="w-full py-3 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 transition-colors"
          >
            Limpar Filtros
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-luxury-card p-4 rounded-2xl border border-zinc-800">
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Filter size={16} className="lg:hidden" />
                <span className="hidden sm:inline">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-white font-bold cursor-pointer"
                >
                  <option value="relevant">Relevância</option>
                  <option value="price-low">Menor Preço</option>
                  <option value="price-high">Maior Preço</option>
                  <option value="rating">Melhor Avaliação</option>
                  <option value="newest">Lançamentos</option>
                </select>
              </div>

              <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

              <div className="flex items-center gap-2">
                <button className="p-2 text-accent bg-accent/10 rounded-lg"><LayoutGrid size={20} /></button>
                <button className="p-2 text-zinc-500 hover:text-zinc-300"><List size={20} /></button>
              </div>
            </div>
          </div>

          {/* Active Filters Tags */}
          {(activeCategory || searchQuery || priceRange[1] < 5000) && (
            <div className="flex flex-wrap gap-2">
              {activeCategory && (
                <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                  Categoria: {activeCategory}
                  <button onClick={() => setSearchParams({})}><X size={12} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                  Busca: {searchQuery}
                  <button onClick={() => setSearchQuery('')}><X size={12} /></button>
                </span>
              )}
              <p className="text-xs text-zinc-500 ml-auto self-center">
                Mostrando <span className="text-white font-bold">{filteredProducts.length}</span> produtos
              </p>
            </div>
          )}

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-24 space-y-6">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700">
                <Search size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold">Nenhum produto encontrado</h3>
                <p className="text-zinc-500">Tente ajustar seus filtros ou buscar por outro termo.</p>
              </div>
              <button onClick={clearFilters} className="btn-primary">Limpar Todos os Filtros</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
