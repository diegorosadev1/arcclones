import React, { useEffect } from 'react';
import { X, Truck, MapPin, Clock, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useOrderStore } from '../../../store/useOrderStore';
import { clsx } from 'clsx';

interface OrderTrackingProps {
  orderId: string;
  onClose: () => void;
}

export function OrderTracking({ orderId, onClose }: OrderTrackingProps) {
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
        className="w-full max-w-2xl bg-luxury-card border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold">Rastreamento</h3>
            {currentOrder && (
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                #{currentOrder.orderNumber} • {currentOrder.carrier}
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
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Buscando rastreio...</p>
            </div>
          ) : error ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 opacity-50" />
              <p className="text-zinc-500">Erro ao carregar rastreamento.</p>
              <button onClick={() => fetchOrderById(orderId)} className="btn-primary px-8 py-3">Tentar Novamente</button>
            </div>
          ) : currentOrder ? (
            <div className="space-y-10">
              {/* Tracking Summary */}
              <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Código de Rastreio</p>
                  <p className="text-sm font-mono font-bold text-accent">{currentOrder.trackingCode || 'Não disponível'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Previsão de Entrega</p>
                  <p className="text-sm font-bold text-white">{currentOrder.estimatedDelivery ? new Date(currentOrder.estimatedDelivery).toLocaleDateString('pt-BR') : 'A definir'}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Postado</span>
                  <span>Em Trânsito</span>
                  <span>Entregue</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                  <div className={clsx(
                    "h-full transition-all duration-1000",
                    currentOrder.status === 'Delivered' ? "w-full bg-emerald-500" :
                    currentOrder.status === 'Shipped' ? "w-2/3 bg-accent" : "w-1/3 bg-blue-500"
                  )} />
                </div>
              </div>

              {/* Tracking History */}
              <div className="space-y-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Clock size={14} /> Atualizações de Rastreio
                </h4>
                <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                  {currentOrder.trackingHistory && Array.isArray(currentOrder.trackingHistory) && currentOrder.trackingHistory.length > 0 ? (
                    currentOrder.trackingHistory.map((track, i) => (
                      <div key={i} className="relative pl-8">
                        <div className={clsx(
                          "absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-zinc-900",
                          i === 0 ? "bg-accent shadow-[0_0_10px_rgba(225,29,72,0.5)]" : "bg-zinc-800"
                        )} />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className={clsx("text-sm font-bold", i === 0 ? "text-white" : "text-zinc-400")}>{track.status}</p>
                            <span className="text-[10px] text-zinc-500">{new Date(track.date).toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <MapPin size={12} />
                            <span>{track.location}</span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{track.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="pl-8 text-zinc-500 text-sm italic">
                      As informações de rastreio estarão disponíveis assim que o objeto for postado.
                    </div>
                  )}
                </div>
              </div>

              {currentOrder.trackingCode && (
                <button className="w-full py-4 rounded-2xl border border-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-2">
                  Ver no site da transportadora <ExternalLink size={14} />
                </button>
              )}
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
