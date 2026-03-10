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
  createProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
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

      createProduct: async (newProduct) => {
        const { images, promoPrice, newArrival, bestSeller, ...productData } =
          newProduct;

        const { data, error } = await supabase
          .from("products")
          .insert({
            name: productData.name,
            category: productData.category,
            price: productData.price,
            promo_price: promoPrice ?? null,
            description: productData.description,
            rating: productData.rating,
            stock: productData.stock,
            sku: productData.sku,
            brand: productData.brand,
            material: productData.material,
            color: productData.color,
            featured: productData.featured ?? false,
            new_arrival: newArrival ?? false,
            best_seller: bestSeller ?? false,
          })
          .select()
          .single();

        if (error || !data) {
          console.error("Erro ao criar produto:", error);
          return;
        }

        if (images?.length) {
          const imageRows = images.map((imageUrl, index) => ({
            product_id: data.id,
            image_url: imageUrl,
            position: index,
          }));

          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageRows);

          if (imagesError) {
            console.error("Erro ao criar imagens do produto:", imagesError);
          }
        }

        await get().fetchProducts();
      },

      updateProduct: async (id, updatedFields) => {
        const { images, promoPrice, newArrival, bestSeller, ...rest } =
          updatedFields;

        const payload: any = {};

        if (rest.name !== undefined) payload.name = rest.name;
        if (rest.category !== undefined) payload.category = rest.category;
        if (rest.price !== undefined) payload.price = rest.price;
        if (updatedFields.promoPrice !== undefined)
          payload.promo_price = updatedFields.promoPrice ?? null;
        if (rest.description !== undefined)
          payload.description = rest.description;
        if (rest.rating !== undefined) payload.rating = rest.rating;
        if (rest.stock !== undefined) payload.stock = rest.stock;
        if (rest.sku !== undefined) payload.sku = rest.sku;
        if (rest.brand !== undefined) payload.brand = rest.brand;
        if (rest.material !== undefined) payload.material = rest.material;
        if (rest.color !== undefined) payload.color = rest.color;
        if (rest.featured !== undefined) payload.featured = rest.featured;
        if (updatedFields.newArrival !== undefined)
          payload.new_arrival = updatedFields.newArrival;
        if (updatedFields.bestSeller !== undefined)
          payload.best_seller = updatedFields.bestSeller;

        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", id);

        if (error) {
          console.error("Erro ao atualizar produto:", error);
          return;
        }

        if (images) {
          const { error: deleteImagesError } = await supabase
            .from("product_images")
            .delete()
            .eq("product_id", id);

          if (deleteImagesError) {
            console.error("Erro ao limpar imagens antigas:", deleteImagesError);
            return;
          }

          if (images.length) {
            const imageRows = images.map((imageUrl, index) => ({
              product_id: id,
              image_url: imageUrl,
              position: index,
            }));

            const { error: insertImagesError } = await supabase
              .from("product_images")
              .insert(imageRows);

            if (insertImagesError) {
              console.error("Erro ao recriar imagens:", insertImagesError);
              return;
            }
          }
        }

        await get().fetchProducts();
      },

      deleteProduct: async (id) => {
        const { error } = await supabase.from("products").delete().eq("id", id);

        if (error) {
          console.error("Erro ao deletar produto:", error);
          return;
        }

        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      toggleStatus: async (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;

        const nextStock = product.stock > 0 ? 0 : 10;

        const { error } = await supabase
          .from("products")
          .update({ stock: nextStock })
          .eq("id", id);

        if (error) {
          console.error("Erro ao atualizar estoque:", error);
          return;
        }

        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: nextStock } : p,
          ),
        }));
      },

      toggleFeatured: async (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;

        const nextFeatured = !product.featured;

        const { error } = await supabase
          .from("products")
          .update({ featured: nextFeatured })
          .eq("id", id);

        if (error) {
          console.error("Erro ao atualizar featured:", error);
          return;
        }

        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, featured: nextFeatured } : p,
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
