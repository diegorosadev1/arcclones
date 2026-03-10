/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.newArrival && (
            <span className="bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Novo
            </span>
          )}
          {product.promoPrice && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Oferta
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              isWishlisted ? "bg-accent text-white" : "bg-white text-zinc-900 hover:bg-accent hover:text-white"
            )}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="w-10 h-10 bg-white text-zinc-900 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="w-10 h-10 bg-white text-zinc-900 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-accent text-[10px] font-bold uppercase tracking-widest">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-zinc-400 font-medium">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="block group-hover:text-accent transition-colors mb-3">
          <h3 className="font-display font-bold text-lg truncate">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-3">
          {product.promoPrice ? (
            <>
              <span className="text-xl font-bold text-white">
                R$ {product.promoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-zinc-500 line-through">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-white">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
