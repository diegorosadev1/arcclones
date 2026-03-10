/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronLeft, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';

export function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.promoPrice || item.price) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 45.00;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700"
        >
          <ShoppingBag size={48} />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-bold">Seu carrinho está vazio</h2>
          <p className="text-zinc-500 max-w-md mx-auto">Parece que você ainda não adicionou nenhum item de luxo ao seu carrinho. Explore nossa coleção exclusiva!</p>
        </div>
        <Link to="/catalog" className="btn-primary inline-flex px-10 py-4">
          Começar a Comprar <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-display font-bold">Meu Carrinho</h1>
        <Link to="/catalog" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-accent transition-colors">
          <ChevronLeft size={16} /> Continuar Comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6"
              >
                <Link to={`/product/${item.id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </Link>

                <div className="flex-grow space-y-1 text-center sm:text-left">
                  <span className="text-accent text-[10px] font-bold uppercase tracking-widest">{item.category}</span>
                  <Link to={`/product/${item.id}`} className="block hover:text-accent transition-colors">
                    <h3 className="font-display font-bold text-lg">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-zinc-500">SKU: {item.sku}</p>
                </div>

                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-1">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right min-w-[120px]">
                  <p className="font-bold text-lg">
                    R$ {((item.promoPrice || item.price) * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {item.quantity}x R$ {(item.promoPrice || item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-zinc-600 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="glass-card p-8 space-y-8">
            <h3 className="font-display font-bold text-2xl">Resumo do Pedido</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Frete</span>
                <span className={shipping === 0 ? "text-emerald-500 font-bold" : "text-white font-medium"}>
                  {shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-zinc-500 text-right italic">Faltam R$ {(500 - subtotal).toLocaleString('pt-BR')} para frete grátis</p>
              )}
              <div className="h-px bg-zinc-800" />
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span className="text-accent">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cupom de desconto"
                  className="flex-grow bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
                />
                <button className="btn-outline py-2 px-6 text-xs uppercase tracking-widest font-bold">Aplicar</button>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-4 uppercase tracking-widest text-sm font-bold"
              >
                Finalizar Compra <ArrowRight size={18} />
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Pagamento 100% seguro e criptografado</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <Truck size={16} className="text-accent" />
                <span>Entrega garantida em todo o Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <CreditCard size={16} className="text-zinc-400" />
                <span>Parcelamento em até 10x sem juros</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-accent/5 border-accent/20">
            <p className="text-xs text-center text-zinc-400">
              Precisa de ajuda? Fale com um consultor via <span className="text-accent font-bold cursor-pointer hover:underline">WhatsApp</span> ou <span className="text-accent font-bold cursor-pointer hover:underline">Chat Online</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
