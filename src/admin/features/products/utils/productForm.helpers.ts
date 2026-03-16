import { Product } from "@/src/types";

export const getEmptyProduct = (): Partial<Product> => ({
  name: "",
  brand: "",
  category: "Watches",
  price: 0,
  promoPrice: undefined,
  description: "",
  images: [],
  rating: 4.5,
  stock: 0,
  sku: `ARC-${Math.floor(Math.random() * 90000) + 10000}`,
  material: "",
  color: "",
  featured: false,
  newArrival: true,
  bestSeller: false,
});

export const validateProductForm = (formData: Partial<Product>) => {
  const errors: string[] = [];

  if (!formData.name) errors.push("Nome do produto é obrigatório");
  if (!formData.price || formData.price <= 0) {
    errors.push("Preço deve ser maior que zero");
  }
  if (!formData.category) errors.push("Categoria é obrigatória");

  return errors;
};