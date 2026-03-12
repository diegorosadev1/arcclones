/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreState {
  cart: CartItem[];
  notifications: Notification[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      notifications: [],

      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity }] });
        }
        get().addNotification(`${product.name} adicionado ao carrinho`, 'success');
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
        get().addNotification('Item removido do carrinho', 'info');
      },

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      addNotification: (message, type = 'info') => {
        const id = Math.random().toString(36).substring(7);
        set({ notifications: [...get().notifications, { id, message, type }] });
        setTimeout(() => get().removeNotification(id), 3000);
      },

      removeNotification: (id) => {
        set({ notifications: get().notifications.filter((n) => n.id !== id) });
      },
    }),
    {
      name: 'luxury-store-storage',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);
