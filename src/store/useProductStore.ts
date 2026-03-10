/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../types";
import { supabase } from "../lib/supabase";

interface ProductStoreState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => void;
  createProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStatus: (id: string) => void;
  toggleFeatured: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,

      fetchProducts: async () => {
        set({ isLoading: true });

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*");

        if (productsError) {
          console.error("Erro ao buscar products:", productsError);
          set({ isLoading: false });
          return;
        }

        const { data: imagesData, error: imagesError } = await supabase
          .from("product_images")
          .select("product_id, image_url, position");

        if (imagesError) {
          console.error("Erro ao buscar product_images:", imagesError);
          set({ isLoading: false });
          return;
        }

        const mappedProducts: Product[] = (productsData || []).map((p: any) => {
          const images = (imagesData || [])
            .filter((img: any) => img.product_id === p.id)
            .sort((a: any, b: any) => a.position - b.position)
            .map((img: any) => img.image_url);

          return {
            id: p.id,
            name: p.name,
            category: p.category,
            price: Number(p.price),
            promoPrice: p.promo_price ? Number(p.promo_price) : undefined,
            description: p.description,
            images,
            rating: Number(p.rating),
            stock: p.stock,
            sku: p.sku,
            brand: p.brand,
            material: p.material,
            color: p.color,
            featured: p.featured,
            newArrival: p.new_arrival,
            bestSeller: p.best_seller,
          };
        });

        set({
          products: mappedProducts,
          isLoading: false,
        });
      },

      addProduct: (newProduct) => {
        const productWithId = {
          ...newProduct,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({ products: [productWithId, ...state.products] }));
      },

      createProduct: (newProduct) => {
        const productWithId = {
          ...newProduct,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({ products: [productWithId, ...state.products] }));
      },

      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedFields } : p,
          ),
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
            p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 10 } : p,
          ),
        }));
      },

      toggleFeatured: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, featured: !p.featured } : p,
          ),
        }));
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },
    }),
    {
      name: "luxury-products-storage",
    },
  ),
);
