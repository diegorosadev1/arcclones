import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  promo_price: number | null;
  description: string | null;
  rating: number | null;
  stock: number;
  sku: string;
  brand: string | null;
  material: string | null;
  color: string | null;
  featured: boolean;
  new_arrival: boolean;
  best_seller: boolean;
  created_at?: string;
};

type ProductImageRow = {
  product_id: string;
  image_url: string;
  position: number;
};

const validCategories: Category[] = [
  'Watches',
  'Shoulder Bags',
  'Glasses',
  'Jewelry',
];

function normalizeCategory(category: string): Category {
  if (validCategories.includes(category as Category)) {
    return category as Category;
  }

  return 'Watches';
}

function mapProduct(row: ProductRow, images: string[] = []): Product {
  return {
    id: row.id,
    name: row.name,
    category: normalizeCategory(row.category),
    price: Number(row.price),
    promoPrice: row.promo_price != null ? Number(row.promo_price) : undefined,
    description: row.description || '',
    images,
    rating: Number(row.rating || 0),
    stock: Number(row.stock || 0),
    sku: row.sku,
    brand: row.brand || '',
    material: row.material || '',
    color: row.color || '',
    featured: !!row.featured,
    newArrival: !!row.new_arrival,
    bestSeller: !!row.best_seller,
  };
}

async function getImagesByProductIds(productIds: string[]): Promise<ProductImageRow[]> {
  if (!productIds.length) return [];

  const { data, error } = await supabase
    .from('product_images')
    .select('product_id, image_url, position')
    .in('product_id', productIds)
    .order('position', { ascending: true });

  if (error) throw error;

  return (data || []) as ProductImageRow[];
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = (data || []) as ProductRow[];
    const imagesData = await getImagesByProductIds(rows.map((item) => item.id));

    return rows.map((row) => {
      const images = imagesData
        .filter((img) => img.product_id === row.id)
        .sort((a, b) => a.position - b.position)
        .map((img) => img.image_url);

      return mapProduct(row, images);
    });
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    const { data: imagesData, error: imagesError } = await supabase
      .from('product_images')
      .select('product_id, image_url, position')
      .eq('product_id', id)
      .order('position', { ascending: true });

    if (imagesError) throw imagesError;

    const images = ((imagesData || []) as ProductImageRow[]).map((img) => img.image_url);

    return mapProduct(data as ProductRow, images);
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const payload = {
      name: product.name,
      category: product.category,
      price: product.price,
      promo_price: product.promoPrice ?? null,
      description: product.description ?? '',
      rating: product.rating ?? 0,
      stock: product.stock ?? 0,
      sku: product.sku,
      brand: product.brand ?? '',
      material: product.material ?? '',
      color: product.color ?? '',
      featured: product.featured ?? false,
      new_arrival: product.newArrival ?? false,
      best_seller: product.bestSeller ?? false,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;

    if (product.images?.length) {
      const imageRows = product.images.map((url, index) => ({
        product_id: data.id,
        image_url: url,
        position: index,
      }));

      const { error: imagesInsertError } = await supabase
        .from('product_images')
        .insert(imageRows);

      if (imagesInsertError) throw imagesInsertError;
    }

    const created = await this.getById(data.id);
    if (!created) {
      throw new Error('Produto criado, mas não foi possível recarregar os dados.');
    }

    return created;
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const payload = {
      ...(product.name !== undefined && { name: product.name }),
      ...(product.category !== undefined && { category: product.category }),
      ...(product.price !== undefined && { price: product.price }),
      ...(product.promoPrice !== undefined && { promo_price: product.promoPrice ?? null }),
      ...(product.description !== undefined && { description: product.description ?? '' }),
      ...(product.rating !== undefined && { rating: product.rating }),
      ...(product.stock !== undefined && { stock: product.stock }),
      ...(product.sku !== undefined && { sku: product.sku }),
      ...(product.brand !== undefined && { brand: product.brand ?? '' }),
      ...(product.material !== undefined && { material: product.material ?? '' }),
      ...(product.color !== undefined && { color: product.color ?? '' }),
      ...(product.featured !== undefined && { featured: product.featured }),
      ...(product.newArrival !== undefined && { new_arrival: product.newArrival }),
      ...(product.bestSeller !== undefined && { best_seller: product.bestSeller }),
    };

    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id);

    if (error) throw error;

    if (product.images !== undefined) {
      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', id);

      if (deleteImagesError) throw deleteImagesError;

      if (product.images.length > 0) {
        const imageRows = product.images.map((url, index) => ({
          product_id: id,
          image_url: url,
          position: index,
        }));

        const { error: insertImagesError } = await supabase
          .from('product_images')
          .insert(imageRows);

        if (insertImagesError) throw insertImagesError;
      }
    }

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error('Produto atualizado, mas não foi possível recarregar os dados.');
    }

    return updated;
  },

  async delete(id: string): Promise<void> {
    const { error: deleteImagesError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', id);

    if (deleteImagesError) throw deleteImagesError;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};