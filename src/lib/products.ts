import { supabase } from "./supabase";
import type { Product } from "../types";

export async function fetchProducts(): Promise<Product[]> {
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("*");

  if (productsError) {
    console.error("Erro ao buscar products:", productsError);
    return [];
  }

  const { data: imagesData, error: imagesError } = await supabase
    .from("product_images")
    .select("product_id, image_url, position");

  if (imagesError) {
    console.error("Erro ao buscar product_images:", imagesError);
    return [];
  }

  return (productsData || []).map((p: any) => {
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
}
