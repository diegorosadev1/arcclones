/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  XCircle, 
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileText,
  User as UserIcon,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

import { Order, OrderStatus, PaymentStatus } from '../../products/types/types';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminOrdersStore } from '../store/useAdminOrdersStore';
import { DataTable } from '@/src/admin/components/shared/DataTable';

export function OrderList() {
  const { orders, isLoading, updateOrderStatus, cancelOrder } = useAdminOrdersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      pending: "bg-amber-500/10 text-amber-500",
      processing: "bg-blue-500/10 text-blue-500",
      shipped: "bg-indigo-500/10 text-indigo-500",
      delivered: "bg-emerald-500/10 text-emerald-500",
      cancelled: "bg-red-500/10 text-red-500"
    };
    const labels: Record<OrderStatus, string> = {
      pending: "Pendente",
      processing: "Processando",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado"
    };
    return (
      <span className={clsx("text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  const getPaymentBadge = (status: PaymentStatus) => {
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
      <span className={clsx("text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  const columns = [
    {
      header: 'Pedido',
      accessor: (o: Order) => (
        <div className="space-y-1">
          <p className="font-bold text-white">{o.orderNumber}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
      ),
    },
    {
      header: 'Cliente',
      accessor: (o: Order) => (
        <div>
          <p className="font-bold text-white">{o.customerName}</p>
          <p className="text-[10px] text-zinc-500">{o.customerEmail}</p>
        </div>
      ),
    },
    {
      header: 'Itens',
      accessor: (o: Order) => (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {o.items.slice(0, 3).map((item, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-luxury-black overflow-hidden bg-zinc-900">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
            {o.items.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-luxury-black bg-zinc-800 flex items-center justify-center text-[8px] font-bold">
                +{o.items.length - 3}
              </div>
            )}
          </div>
          <span className="text-[10px] text-zinc-500 font-bold">{o.items.length} {o.items.length === 1 ? 'item' : 'itens'}</span>
        </div>
      ),
    },
    {
      header: 'Total',
      accessor: (o: Order) => (
        <p className="font-bold text-white">R$ {o.total.toLocaleString('pt-BR')}</p>
      ),
    },
    {
      header: 'Pagamento',
      accessor: (o: Order) => (
        <div className="flex flex-col gap-1">
          {getPaymentBadge(o.paymentStatus)}
          <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">{o.paymentMethod.replace('_', ' ')}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (o: Order) => getStatusBadge(o.status),
    },
    {
      header: 'Ações',
      accessor: (o: Order) => (
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === o.id ? null : o.id);
            }}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          
          <AnimatePresence>
            {activeMenu === o.id && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden"
                >
                  <button 
                    onClick={() => {
                      navigate(`/admin/pedidos/${o.id}`);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <Eye size={14} /> Ver detalhes
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedOrder(o);
                      setIsStatusModalOpen(true);
                      setActiveMenu(null);
                    }}
                    disabled={o.status === 'cancelled' || o.status === 'delivered'}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={14} /> Atualizar status
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Visualizando fatura do pedido ${o.orderNumber}`);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <FileText size={14} /> Ver fatura
                  </button>
                  <button 
                    onClick={() => {
                      navigate(`/admin/usuarios?search=${o.customerEmail}`);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <UserIcon size={14} /> Ver cliente
                  </button>
                  <div className="h-px bg-zinc-800" />
                  <button 
                    onClick={() => {
                      if (confirm(`Deseja realmente cancelar o pedido ${o.orderNumber}? Esta ação não pode ser desfeita.`)) {
                        cancelOrder(o.id);
                      }
                      setActiveMenu(null);
                    }}
                    disabled={o.status === 'delivered' || o.status === 'cancelled'}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <XCircle size={14} /> Cancelar pedido
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ),
    },
  ];

  const handleStatusUpdate = (status: OrderStatus) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, status);
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Pedidos</h1>
          <p className="text-zinc-500 text-sm">Gerencie as vendas e status de entrega.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-outline px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Calendar size={16} /> Exportar Relatório
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="relative w-full lg:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por número, cliente ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors text-zinc-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
            <Filter size={16} className="text-zinc-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-zinc-300 cursor-pointer"
            >
              <option value="all">Status do Pedido</option>
              <option value="pending">Pendente</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
            <select 
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-zinc-300 cursor-pointer"
            >
              <option value="all">Status de Pagamento</option>
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="refunded">Reembolsado</option>
              <option value="failed">Falhou</option>
            </select>
          </div>

          <div className="h-8 w-px bg-zinc-800 hidden lg:block" />

          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Total: <span className="text-white">{filteredOrders.length} pedidos</span>
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredOrders} 
        isLoading={isLoading}
        onRowClick={(o) => navigate(`/admin/pedidos/${o.id}`)}
      />

      {/* Status Update Modal */}
      <AnimatePresence>
        {isStatusModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStatusModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold">Atualizar Status</h3>
                <p className="text-zinc-500 text-sm">Pedido {selectedOrder.orderNumber} • Status atual: <span className="text-white font-bold">{selectedOrder.status}</span></p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'pending', label: 'Pendente', disabled: selectedOrder.status !== 'pending' },
                  { id: 'processing', label: 'Em Processamento', disabled: !['pending', 'processing'].includes(selectedOrder.status) },
                  { id: 'shipped', label: 'Enviado', disabled: !['processing', 'shipped'].includes(selectedOrder.status) },
                  { id: 'delivered', label: 'Entregue', disabled: !['shipped', 'delivered'].includes(selectedOrder.status) },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStatusUpdate(s.id as OrderStatus)}
                    disabled={s.disabled || selectedOrder.status === s.id}
                    className={clsx(
                      "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group",
                      selectedOrder.status === s.id 
                        ? "border-accent bg-accent/5 text-accent" 
                        : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-white",
                      s.disabled && "opacity-30 cursor-not-allowed grayscale"
                    )}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{s.label}</span>
                    {selectedOrder.status === s.id && <AlertCircle size={16} />}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsStatusModalOpen(false)}
                  className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pagination Mock */}
      <div className="flex items-center justify-between text-zinc-500">
        <p className="text-xs font-bold uppercase tracking-widest">Página 1 de 1</p>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors disabled:opacity-30" disabled>
            <ChevronLeft size={18} />
          </button>
          <button className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors disabled:opacity-30" disabled>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
