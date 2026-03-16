/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Order, OrderStatus } from '../../products/types/types';
import { mockOrders } from '@/src/admin/mocks';


interface AdminOrdersStoreState {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => void;
  updateOrderStatus: (id: string, status: OrderStatus, description?: string) => void;
  cancelOrder: (id: string, reason?: string) => void;
  simulatePayment: (id: string) => void;
  simulateShipping: (id: string) => void;
}

export const useAdminOrdersStore = create<AdminOrdersStoreState>((set) => ({
  orders: mockOrders,
  isLoading: false,
  fetchOrders: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ isLoading: false });
    }, 500);
  },
  updateOrderStatus: (id, status, description) => {
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== id) return o;
        
        const now = new Date().toISOString();
        const labels: Record<OrderStatus, string> = {
          pending: 'Pendente',
          processing: 'Em Processamento',
          shipped: 'Enviado',
          delivered: 'Entregue',
          cancelled: 'Cancelado'
        };

        const newHistoryEntry = {
          status,
          label: labels[status],
          timestamp: now,
          description: description || `Status atualizado para ${labels[status]}`
        };

        return {
          ...o,
          status,
          updatedAt: now,
          statusHistory: [...o.statusHistory, newHistoryEntry],
          ...(status === 'shipped' ? { shippedAt: now } : {}),
          ...(status === 'delivered' ? { deliveredAt: now } : {}),
        };
      }),
    }));
  },
  cancelOrder: (id, reason) => {
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== id) return o;
        const now = new Date().toISOString();
        return {
          ...o,
          status: 'cancelled',
          cancelledAt: now,
          updatedAt: now,
          statusHistory: [
            ...o.statusHistory,
            { status: 'cancelled', label: 'Cancelado', timestamp: now, description: reason || 'Pedido cancelado pelo administrador.' }
          ]
        };
      }),
    }));
  },
  simulatePayment: (id) => {
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== id || o.paymentStatus === 'paid') return o;
        const now = new Date().toISOString();
        return {
          ...o,
          paymentStatus: 'paid',
          paidAt: now,
          updatedAt: now,
          status: o.status === 'pending' ? 'processing' : o.status,
          paymentEvents: [
            ...o.paymentEvents,
            { event: 'Confirmação Automática', status: 'paid', timestamp: now, description: 'Pagamento confirmado via gateway.' }
          ],
          statusHistory: o.status === 'pending' ? [
            ...o.statusHistory,
            { status: 'processing', label: 'Pagamento Confirmado', timestamp: now, description: 'Pagamento aprovado. Pedido em processamento.' }
          ] : o.statusHistory
        };
      }),
    }));
  },
  simulateShipping: (id) => {
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== id || o.status !== 'processing') return o;
        const now = new Date().toISOString();
        return {
          ...o,
          status: 'shipped',
          shippedAt: now,
          updatedAt: now,
          trackingCode: `LX${Math.floor(Math.random() * 1000000000)}BR`,
          carrier: 'Loggi Premium',
          deliveryForecast: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          statusHistory: [
            ...o.statusHistory,
            { status: 'shipped', label: 'Pedido Enviado', timestamp: now, description: 'Pedido coletado pela transportadora.' }
          ]
        };
      }),
    }));
  },
}));
