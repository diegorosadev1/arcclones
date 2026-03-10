/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCw, ChevronRight, Minus, Plus, Share2, MessageSquare } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProductStore();
  const { toggleFavorite, isFavorite } = useWishlistStore();
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = useMemo(() => products.find(p => p.id === id), [id, products]);

  if (!product) {
    return (
      <div className="pt-40 pb-24 text-center space-y-6">
        <h2 className="text-4xl font-display font-bold">Produto não encontrado</h2>
        <Link to="/catalog" className="btn-primary inline-flex">Voltar ao Catálogo</Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isWishlisted = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest mb-12">
        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/catalog" className="hover:text-accent transition-colors">Catálogo</Link>
        <ChevronRight size={12} />
        <Link to={`/catalog?category=${product.category}`} className="hover:text-accent transition-colors">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-accent">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800"
          >
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={clsx(
                  "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                  activeImage === i ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-accent text-xs font-bold uppercase tracking-widest">{product.brand}</span>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-white">{product.rating}</span>
                <span className="text-xs text-zinc-500">(124 avaliações)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">{product.name}</h1>
            <p className="text-zinc-400 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-2">
            {product.promoPrice ? (
              <div className="flex items-end gap-4">
                <span className="text-4xl font-bold text-white">
                  R$ {product.promoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xl text-zinc-500 line-through mb-1">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2 py-1 rounded mb-1">
                  -{Math.round((1 - product.promoPrice / product.price) * 100)}%
                </span>
              </div>
            ) : (
              <span className="text-4xl font-bold text-white">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
            <p className="text-zinc-500 text-sm">Em até 10x de R$ {((product.promoPrice || product.price) / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</p>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Specifications Mini */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Material</p>
              <p className="text-sm font-medium">{product.material}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Cor</p>
              <p className="text-sm font-medium">{product.color}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">SKU</p>
              <p className="text-sm font-medium">{product.sku}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Estoque</p>
              <p className="text-sm font-medium">{product.stock > 0 ? 'Disponível' : 'Esgotado'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button
                onClick={() => toggleFavorite(product.id)}
                className={clsx(
                  "flex-grow flex items-center justify-center gap-2 py-4 rounded-full border transition-all duration-300 font-bold text-sm uppercase tracking-widest",
                  isWishlisted ? "bg-accent/10 border-accent text-accent" : "border-zinc-800 text-zinc-400 hover:border-accent hover:text-accent"
                )}
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                {isWishlisted ? 'Favoritado' : 'Adicionar aos Favoritos'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={handleAddToCart} className="btn-outline py-4 uppercase tracking-widest text-sm font-bold">
                <ShoppingCart size={18} /> Adicionar ao Carrinho
              </button>
              <button onClick={handleBuyNow} className="btn-primary py-4 uppercase tracking-widest text-sm font-bold">
                Comprar Agora
              </button>
            </div>
          </div>

          {/* Shipping & Trust */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <Truck size={20} className="text-accent mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">Frete Grátis</p>
              <p className="text-[10px] text-zinc-500">Acima de R$ 500</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <ShieldCheck size={20} className="text-accent mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">Garantia</p>
              <p className="text-[10px] text-zinc-500">12 Meses Oficial</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <RefreshCw size={20} className="text-accent mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">Troca Grátis</p>
              <p className="text-[10px] text-zinc-500">Até 30 Dias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Info */}
      <div className="mb-24">
        <div className="flex border-b border-zinc-800 mb-8">
          <button className="px-8 py-4 border-b-2 border-accent text-accent font-bold text-sm uppercase tracking-widest">Descrição</button>
          <button className="px-8 py-4 text-zinc-500 hover:text-zinc-300 font-bold text-sm uppercase tracking-widest transition-colors">Especificações</button>
          <button className="px-8 py-4 text-zinc-500 hover:text-zinc-300 font-bold text-sm uppercase tracking-widest transition-colors">Avaliações (124)</button>
        </div>
        <div className="max-w-3xl space-y-6 text-zinc-400 leading-relaxed">
          <p>
            O {product.name} representa o ápice do design contemporâneo aliado à funcionalidade excepcional. 
            Cada detalhe foi meticulosamente pensado para proporcionar uma experiência única de luxo e conforto.
          </p>
          <p>
            Utilizando apenas os materiais mais nobres, este item da coleção {product.brand} é mais do que um acessório; 
            é uma declaração de estilo e sofisticação que transcende tendências passageiras.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Design exclusivo assinado por especialistas.</li>
            <li>Acabamento artesanal de alta precisão.</li>
            <li>Materiais sustentáveis e de procedência garantida.</li>
            <li>Embalagem de luxo inclusa, ideal para presente.</li>
          </ul>
        </div>
      </div>

      {/* Related Products */}
      <section className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display font-bold">Produtos Relacionados</h2>
          <Link to="/catalog" className="text-accent text-sm font-bold hover:underline">Ver Todos</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
