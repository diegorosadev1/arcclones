/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStore } from './useStore';

interface WishlistStoreState {
  wishlist: string[]; // Product IDs
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      
      toggleFavorite: (productId) => {
        const wishlist = get().wishlist;
        const isIn = wishlist.includes(productId);
        const { addNotification } = useStore.getState();

        if (isIn) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
          addNotification('Removido dos favoritos', 'info');
        } else {
          set({ wishlist: [...wishlist, productId] });
          addNotification('Adicionado aos favoritos', 'success');
        }
      },

      isFavorite: (productId) => get().wishlist.includes(productId),

      clearFavorites: () => set({ wishlist: [] }),
    }),
    {
      name: 'luxury-wishlist-storage',
    }
  )
);
