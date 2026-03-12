import React, { useEffect } from 'react';
import { X, Package, MapPin, CreditCard, Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useOrderStore } from '@/src/store/useOrderStore';
interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
}

export function OrderDetails({ orderId, onClose }: OrderDetailsProps) {
  const { currentOrder, isLoading, error, fetchOrderById } = useOrderStore();

  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId, fetchOrderById]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] bg-luxury-card border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold">Detalhes do Pedido</h3>
            {currentOrder && (
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                #{currentOrder.orderNumber} • {new Date(currentOrder.date).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Buscando detalhes...</p>
            </div>
          ) : error ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 opacity-50" />
              <p className="text-zinc-500">Erro ao carregar detalhes do pedido.</p>
              <button onClick={() => fetchOrderById(orderId)} className="btn-primary px-8 py-3">Tentar Novamente</button>
            </div>
          ) : currentOrder ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Items & Summary */}
              <div className="lg:col-span-2 space-y-10">
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Package size={14} /> Itens do Pedido
                  </h4>
                  <div className="space-y-4">
                    {(currentOrder.items || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-800 shrink-0">
                          <img src={item?.image || 'https://picsum.photos/seed/luxury/100/100'} alt={item?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow">
                          <h5 className="font-bold text-sm">{item?.name || 'Item'}</h5>
                          <p className="text-xs text-zinc-500">Qtd: {item?.quantity || 0}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-accent">R$ {((item?.price || 0) * (item?.quantity || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <p className="text-[10px] text-zinc-500">R$ {(item?.price || 0).toLocaleString('pt-BR')} cada</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Clock size={14} /> Histórico do Pedido
                  </h4>
                  <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                    {(currentOrder.statusHistory || []).map((history, i) => (
                      <div key={i} className="relative pl-8">
                        <div className={clsx(
                          "absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-zinc-900",
                          i === 0 ? "bg-accent shadow-[0_0_10px_rgba(225,29,72,0.5)]" : "bg-zinc-800"
                        )} />
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <p className={clsx("text-sm font-bold", i === 0 ? "text-white" : "text-zinc-400")}>{history.status}</p>
                            <span className="text-[10px] text-zinc-500">{new Date(history.date).toLocaleString('pt-BR')}</span>
                          </div>
                          <p className="text-xs text-zinc-500">{history.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Info & Totals */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <MapPin size={14} /> Entrega
                  </h4>
                  <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 space-y-3">
                    <p className="text-sm font-bold text-white">{currentOrder.shippingAddress?.label || 'Endereço de Entrega'}</p>
                    <div className="text-xs text-zinc-400 space-y-1">
                      <p>{currentOrder.shippingAddress?.street}</p>
                      <p>{currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state}</p>
                      <p>CEP: {currentOrder.shippingAddress?.zip_code}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <CreditCard size={14} /> Pagamento
                  </h4>
                  <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-zinc-400">Método</p>
                      <p className="text-xs font-bold text-white">{currentOrder.paymentMethod}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-zinc-400">Status</p>
                      <span className={clsx(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                        currentOrder.paymentStatus === 'Paid' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                        {currentOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-zinc-800">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Subtotal</span>
                      <span className="text-zinc-300">R$ {currentOrder.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Frete</span>
                      <span className="text-zinc-300">R$ {currentOrder.shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Impostos</span>
                      <span className="text-zinc-300">R$ {currentOrder.tax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-3 flex items-center justify-between border-t border-zinc-800">
                      <span className="font-display font-bold text-lg">Total</span>
                      <span className="font-display font-bold text-2xl text-accent">R$ {currentOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
          <button onClick={onClose} className="btn-primary px-10 py-3 text-sm font-bold uppercase tracking-widest">Fechar</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
