/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CreditCard, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  ExternalLink,
  History
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { OrderStatus, PaymentStatus } from '../../products/types/types';
import { useAdminOrdersStore } from '../store/useAdminOrdersStore';

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useAdminOrdersStore();

  const order = useMemo(() => orders.find(o => o.id === id), [orders, id]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle size={48} className="text-zinc-700" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest">Pedido não encontrado</p>
        <button onClick={() => navigate('/admin/pedidos')} className="btn-outline px-6 py-3 text-[10px] font-bold uppercase tracking-widest">
          Voltar para lista
        </button>
      </div>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      pending: "text-amber-500",
      processing: "text-blue-500",
      shipped: "text-indigo-500",
      delivered: "text-emerald-500",
      cancelled: "text-red-500"
    };
    return colors[status];
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const styles: Record<PaymentStatus, string> = {
      pending: "bg-amber-500/10 text-amber-500",
      paid: "bg-emerald-500/10 text-emerald-500",
      refunded: "bg-purple-500/10 text-purple-500",
      failed: "bg-red-500/10 text-red-500"
    };
    const labels: Record<PaymentStatus, string> = {
      pending: "Pendente",
      paid: "Pago",
      refunded: "Reembolsado",
      failed: "Falhou"
    };
    return (
      <span className={clsx("text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/pedidos')}
            className="p-3 rounded-full border border-zinc-800 hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-bold">{order.orderNumber}</h1>
              <span className={clsx(
                "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
                getStatusColor(order.status).replace('text-', 'border-').replace('text-', 'bg-').concat('/10'),
                getStatusColor(order.status)
              )}>
                {order.status}
              </span>
            </div>
            <p className="text-zinc-500 text-sm">Criado em {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-outline px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <FileText size={16} /> Ver Fatura
          </button>
          <button className="btn-primary px-6 py-3 text-[10px] font-bold uppercase tracking-widest">
            Imprimir Etiqueta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items & Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Items Card */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-accent" />
                <h3 className="font-display font-bold text-lg">Itens do Pedido</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{order.items.length} {order.items.length === 1 ? 'Produto' : 'Produtos'}</span>
            </div>
            <div className="divide-y divide-zinc-800">
              {order.items.map((item, i) => (
                <div key={i} className="p-6 flex items-center gap-6 hover:bg-zinc-900/30 transition-colors">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-zinc-500">SKU: ARC-{item.productId}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-bold text-white">R$ {item.price.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-zinc-500">Qtd: {item.quantity}</p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-accent">R$ {(item.price * item.quantity).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-zinc-900/30 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-white font-bold">R$ {order.subtotal.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Frete</span>
                <span className="text-white font-bold">R$ {order.shipping.toLocaleString('pt-BR')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Desconto</span>
                  <span className="text-red-500 font-bold">- R$ {order.discount.toLocaleString('pt-BR')}</span>
                </div>
              )}
              <div className="h-px bg-zinc-800 my-4" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-display font-bold">Total</span>
                <span className="text-2xl font-display font-bold text-accent">R$ {order.total.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* History Card */}
          <div className="glass-card p-8 space-y-8">
            <div className="flex items-center gap-3">
              <History size={20} className="text-accent" />
              <h3 className="font-display font-bold text-lg">Histórico do Pedido</h3>
            </div>
            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
              {order.statusHistory.slice().reverse().map((entry, i) => (
                <div key={i} className="relative pl-10">
                  <div className={clsx(
                    "absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-luxury-black flex items-center justify-center",
                    i === 0 ? "bg-accent" : "bg-zinc-800"
                  )}>
                    {i === 0 ? <CheckCircle2 size={12} className="text-white" /> : <Clock size={12} className="text-zinc-500" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={clsx("text-sm font-bold", i === 0 ? "text-white" : "text-zinc-400")}>{entry.label}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{new Date(entry.timestamp).toLocaleString('pt-BR')}</p>
                    </div>
                    {entry.description && <p className="text-xs text-zinc-500 leading-relaxed">{entry.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-8">
          {/* Customer Card */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={20} className="text-accent" />
                <h3 className="font-display font-bold text-lg">Cliente</h3>
              </div>
              <button 
                onClick={() => navigate(`/admin/usuarios?search=${order.customerEmail}`)}
                className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-1"
              >
                Perfil <ExternalLink size={12} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-white">{order.customerName}</p>
                  <p className="text-xs text-zinc-500">Cliente desde Out 2025</p>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-zinc-500" />
                  <span className="text-zinc-300">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-zinc-500" />
                  <span className="text-zinc-300">(11) 98765-4321</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Card */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-accent" />
              <h3 className="font-display font-bold text-lg">Entrega</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Endereço de Envio</p>
                <div className="flex gap-3">
                  <MapPin size={18} className="text-zinc-500 shrink-0 mt-1" />
                  <div className="text-sm text-zinc-300 leading-relaxed">
                    <p>{order.shippingAddress.street}, {order.shippingAddress.number}</p>
                    {order.shippingAddress.complement && <p>{order.shippingAddress.complement}</p>}
                    <p>{order.shippingAddress.city} - {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.zip_code}</p>
                  </div>
                </div>
              </div>

              {order.trackingCode && (
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Rastreamento</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Ativo</span>
                  </div>
                  <div className="bg-zinc-900/50 rounded-2xl p-4 space-y-2">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">{order.trackingCode}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{order.carrier}</p>
                  </div>
                  {order.deliveryForecast && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Calendar size={14} />
                      Previsão: <span className="text-white font-bold">{new Date(order.deliveryForecast).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment Card */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-accent" />
              <h3 className="font-display font-bold text-lg">Pagamento</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</p>
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Método</p>
                <p className="text-xs font-bold text-white uppercase tracking-widest">{order.paymentMethod.replace('_', ' ')}</p>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Eventos de Pagamento</p>
                <div className="space-y-4">
                  {order.paymentEvents.map((event, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-1.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-300">{event.event}</p>
                        <p className="text-[10px] text-zinc-500">{new Date(event.timestamp).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
