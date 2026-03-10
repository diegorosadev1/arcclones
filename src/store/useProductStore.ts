/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { products as initialProducts } from '../data/products';

interface ProductStoreState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  createProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStatus: (id: string) => void;
  toggleFeatured: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      isLoading: false,
      
      fetchProducts: () => {
        set({ isLoading: true });
        // Simulate API call
        setTimeout(() => {
          set({ isLoading: false });
        }, 500);
      },

      addProduct: (newProduct) => {
        const productWithId = { ...newProduct, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({ products: [productWithId, ...state.products] }));
      },

      createProduct: (newProduct) => {
        const productWithId = { ...newProduct, id: Math.random().toString(36).substr(2, 9) };
        set((state) => ({ products: [productWithId, ...state.products] }));
      },

      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      toggleStatus: (id) => {
        set((state) => ({
          products: state.products.map((p) => 
            p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 10 } : p
          ),
        }));
      },

      toggleFeatured: (id) => {
        set((state) => ({
          products: state.products.map((p) => 
            p.id === id ? { ...p, featured: !p.featured } : p
          ),
        }));
      },

      getProductById: (id) => {
        return get().products.find(p => p.id === id);
      },
    }),
    {
      name: 'luxury-products-storage',
    }
  )
);
