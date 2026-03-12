import { create } from 'zustand';
import { Product } from '../types';
import { productService } from '../services/productService';

interface ProductStoreState {
  products: Product[];
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;
  fetchProducts: (force?: boolean) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  isLoading: false,
  hasFetched: false,
  error: null,

  fetchProducts: async (force = false) => {
    if (get().isLoading || (get().hasFetched && !force)) return;

    set({ isLoading: true, error: null });

    try {
      // Add a timeout to the fetch call
      const fetchPromise = productService.getAll();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite de carregamento excedido')), 10000)
      );

      const products = await Promise.race([fetchPromise, timeoutPromise]);
      set({
        products,
        hasFetched: true,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Erro ao carregar produtos',
        hasFetched: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (newProduct) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.create(newProduct);
      set((state) => ({ products: [product, ...state.products] }));
    } catch (error: any) {
      set({ error: error?.message || 'Erro ao criar produto' });
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (newProduct) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.create(newProduct);
      set((state) => ({ products: [product, ...state.products] }));
    } catch (error: any) {
      set({ error: error?.message || 'Erro ao criar produto' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, updatedFields) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await productService.update(id, updatedFields);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
      }));
    } catch (error: any) {
      set({ error: error?.message || 'Erro ao atualizar produto' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productService.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error: any) {
      set({ error: error?.message || 'Erro ao deletar produto' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleStatus: async (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    const newStock = product.stock > 0 ? 0 : 10;
    await get().updateProduct(id, { stock: newStock });
  },

  toggleFeatured: async (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    await get().updateProduct(id, { featured: !product.featured });
  },

  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },
}));