import { supabase } from "../lib/supabase";
import { Product } from "../types";
import { products as localProducts } from "../data/products";

type ProductRow = {
  id: string;
  name: string;
  category: Product["category"];
  price: number;
  promo_price?: number | null;
  description: string;
  rating: number;
  stock: number;
  sku: string;
  brand: string;
  material: string;
  color: string;
  featured?: boolean | null;
  new_arrival?: boolean | null;
  best_seller?: boolean | null;
  product_images?: { image_url: string; position: number }[];
};

function mapRowToProduct(row: ProductRow): Product {
  const images = (row.product_images || [])
    .sort((a, b) => a.position - b.position)
    .map((img) => img.image_url);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    promoPrice: row.promo_price ?? undefined,
    description: row.description,
    images,
    rating: row.rating,
    stock: row.stock,
    sku: row.sku,
    brand: row.brand,
    material: row.material,
    color: row.color,
    featured: row.featured ?? false,
    newArrival: row.new_arrival ?? false,
    bestSeller: row.best_seller ?? false,
  };
}

function mapProductToRow(product: Partial<Product>) {
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    promo_price: product.promoPrice ?? null,
    description: product.description,
    rating: product.rating,
    stock: product.stock,
    sku: product.sku,
    brand: product.brand,
    material: product.material,
    color: product.color,
    featured: product.featured ?? false,
    new_arrival: product.newArrival ?? false,
    best_seller: product.bestSeller ?? false,
  };
}

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(image_url, position)")
        .order("name", { ascending: true });

      if (error) {
        console.error("Supabase error fetching products:", error);
        return localProducts as Product[];
      }

      if (!data || data.length === 0) {
        console.warn("No products found in Supabase, using local fallback.");
        return localProducts as Product[];
      }

      return (data as ProductRow[]).map(mapRowToProduct);
    } catch (error) {
      console.error("Error fetching products, using local fallback:", error);
      return localProducts as Product[];
    }
  },

  async getById(id: string): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(image_url, position)")
        .eq("id", id)
        .single();

      if (error || !data) {
        const localProduct = (localProducts as Product[]).find(
          (p) => String(p.id) === String(id),
        );

        if (localProduct) return localProduct;

        throw error || new Error("Produto não encontrado");
      }

      return mapRowToProduct(data as ProductRow);
    } catch (error) {
      console.error("Error fetching product by id, trying local fallback:", error);

      const localProduct = (localProducts as Product[]).find(
        (p) => String(p.id) === String(id),
      );

      if (localProduct) return localProduct;

      throw error;
    }
  },

  async create(productData: Omit<Product, "id">): Promise<Product> {
    const { images = [], ...product } = productData;

    const payload = mapProductToRow(product);

    const { data, error } = await supabase
      .from("products")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }

    const createdId = data.id as string;

    if (images.length > 0) {
      const imageInserts = images.map((url, index) => ({
        product_id: createdId,
        image_url: url,
        position: index,
      }));

      const { error: imgError } = await supabase
        .from("product_images")
        .insert(imageInserts);

      if (imgError) {
        console.error("Error inserting product images:", imgError);
        throw imgError;
      }
    }

    return await this.getById(createdId);
  },

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const { images, ...product } = productData;

    const payload = mapProductToRow(product);

    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }

    if (images) {
      const { error: deleteImagesError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", id);

      if (deleteImagesError) {
        console.error("Error deleting old product images:", deleteImagesError);
        throw deleteImagesError;
      }

      if (images.length > 0) {
        const imageInserts = images.map((url, index) => ({
          product_id: id,
          image_url: url,
          position: index,
        }));

        const { error: imgError } = await supabase
          .from("product_images")
          .insert(imageInserts);

        if (imgError) {
          console.error("Error inserting updated product images:", imgError);
          throw imgError;
        }
      }
    }

    return await this.getById(id);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};