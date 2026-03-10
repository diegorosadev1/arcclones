/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingBag, ChevronRight } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

export function Wishlist() {
  const { products } = useProductStore();
  const { wishlist } = useWishlistStore();
  
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest mb-8">
        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-accent">Favoritos</span>
      </nav>

      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold">Meus Favoritos</h1>
          <p className="text-zinc-500">Sua lista de desejos exclusiva com os itens mais cobiçados.</p>
        </div>
        <p className="text-sm text-zinc-500">
          <span className="text-white font-bold">{wishlistProducts.length}</span> itens salvos
        </p>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-32 space-y-8 glass-card bg-zinc-900/30">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-800"
          >
            <Heart size={48} />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold">Sua lista está vazia</h2>
            <p className="text-zinc-500 max-w-md mx-auto">Você ainda não salvou nenhum item nos seus favoritos. Explore nossa coleção e clique no coração para salvar seus itens preferidos!</p>
          </div>
          <Link to="/catalog" className="btn-primary inline-flex px-10 py-4">
            Explorar Coleção <ArrowRight size={20} />
          </Link>
        </div>
      )}

      {/* Featured Section for Empty Wishlist */}
      {wishlistProducts.length === 0 && (
        <section className="mt-24 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display font-bold">Sugestões para Você</h2>
            <Link to="/catalog" className="text-accent text-sm font-bold hover:underline">Ver Todos</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter(p => p.featured).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
