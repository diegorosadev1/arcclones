import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { products as localProducts } from '../data/products';

export const productService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(image_url, position)')
        .order('name', { ascending: true });

      if (error) {
        console.error('Supabase error fetching products:', error);
        return localProducts as Product[];
      }

      if (!data || data.length === 0) {
        console.warn('No products found in Supabase, using local fallback.');
        return localProducts as Product[];
      }

      const products = data.map((p: any) => {
        const images = (p.product_images || [])
          .sort((a: any, b: any) => a.position - b.position)
          .map((img: any) => img.image_url);

        return {
          ...p,
          images: images.length > 0 ? images : [],
        } as Product;
      });

      return products;
    } catch (error) {
      console.error('Error fetching products, using local fallback:', error);
      return localProducts as Product[];
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(image_url, position)')
        .eq('id', id)
        .single();

      if (error || !data) {
        const localProduct = (localProducts as Product[]).find((p) => String(p.id) === String(id));
        if (localProduct) return localProduct;
        throw error || new Error('Produto não encontrado');
      }

      const images = (data.product_images || [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((img: any) => img.image_url);

      return {
        ...data,
        images: images.length > 0 ? images : [],
      } as Product;
    } catch (error) {
      console.error('Error fetching product by id, trying local fallback:', error);

      const localProduct = (localProducts as Product[]).find((p) => String(p.id) === String(id));
      if (localProduct) return localProduct;

      throw error;
    }
  },

  async create(productData: Omit<Product, 'id'>) {
    const { images, ...product } = productData as any;

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    const newProduct = data as Product;

    if (images && images.length > 0) {
      const imageInserts = images.map((url: string, index: number) => ({
        product_id: newProduct.id,
        image_url: url,
        position: index,
      }));

      const { error: imgError } = await supabase
        .from('product_images')
        .insert(imageInserts);

      if (imgError) throw imgError;
    }

    return { ...newProduct, images: images || [] };
  },

  async update(id: string, productData: Partial<Product>) {
    const { images, ...product } = productData as any;

    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    const updatedProduct = data as Product;

    if (images) {
      await supabase.from('product_images').delete().eq('product_id', id);

      if (images.length > 0) {
        const imageInserts = images.map((url: string, index: number) => ({
          product_id: id,
          image_url: url,
          position: index,
        }));

        const { error: imgError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imgError) throw imgError;
      }
    }

    return { ...updatedProduct, images: images || [] };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};