import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../../../../store/useProductStore";
import type { Product } from "../../../../types";

interface UseProductPageDataProps {
  mode: "create" | "edit" | "view";
}

export function useProductPageData({ mode }: UseProductPageDataProps) {
  const { id } = useParams();
  const { products, fetchProductById, isLoading, error, clearError } =
    useProductStore();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      clearError();
      setNotFound(false);

      if (mode === "create") {
        setProduct(undefined);
        return;
      }

      if (!id) {
        setNotFound(true);
        return;
      }

      const localProduct = products.find((p) => p.id === id);

      if (localProduct) {
        setProduct(localProduct);
        return;
      }

      const fetched = await fetchProductById(id);
      if (!active) return;

      if (!fetched) {
        setNotFound(true);
        return;
      }

      setProduct(fetched);
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id, mode, products, fetchProductById, clearError]);

  return {
    product,
    isLoading,
    error,
    notFound,
  };
}