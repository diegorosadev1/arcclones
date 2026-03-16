import { create } from 'zustand';
import { Product } from '../types';
import { productService } from '../services/productService';

interface ProductStoreState {
  products: Product[];
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;
  fetchProducts: (force?: boolean) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  clearError: () => void;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  isLoading: false,
  hasFetched: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchProducts: async (force = false) => {
    if (get().isLoading || (get().hasFetched && !force)) return;

    set({ isLoading: true, error: null });

    try {
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

  fetchProductById: async (id) => {
    const existing = get().products.find((p) => p.id === id);
    if (existing) return existing;

    set({ isLoading: true, error: null });

    try {
      const product = await productService.getById(id);

      if (!product) {
        set({ error: 'Produto não encontrado' });
        return null;
      }

      set((state) => {
        const alreadyExists = state.products.some((p) => p.id === product.id);

        return {
          products: alreadyExists
            ? state.products.map((p) => (p.id === product.id ? product : p))
            : [product, ...state.products],
          error: null,
        };
      });

      return product;
    } catch (error: any) {
      set({ error: error?.message || 'Erro ao carregar produto' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (newProduct) => {
    set({ isLoading: true, error: null });

    try {
      const product = await productService.create(newProduct);
      set((state) => ({
        products: [product, ...state.products],
        error: null,
      }));
      return product;
    } catch (error: any) {
      set({ error: error?.message || 'Erro ao criar produto' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (newProduct) => {
    set({ isLoading: true, error: null });

    try {
      const product = await productService.create(newProduct);
      set((state) => ({
        products: [product, ...state.products],
        error: null,
      }));
      return product;
    } catch (error: any) {
      set({ error: error?.message || 'Erro ao criar produto' });
      return null;
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
        error: null,
      }));
      return updatedProduct;
    } catch (error: any) {
      set({ error: error?.message || 'Erro ao atualizar produto' });
      return null;
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
        error: null,
      }));
      return true;
    } catch (error: any) {
      set({ error: error?.message || 'Erro ao deletar produto' });
      return false;
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