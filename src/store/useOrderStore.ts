import { create } from 'zustand';
import { Order } from '../types';
import { orderService } from '../services/orderService';
import { useStore } from './useStore';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: (userId: string) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id'>) => Promise<Order | null>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await orderService.getOrders(userId);
      set({ orders, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getOrderById(id);
      set({ currentOrder: order, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.createOrder(orderData);
      set((state) => ({ 
        orders: [order, ...state.orders],
        isLoading: false 
      }));
      return order;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  }
}));
