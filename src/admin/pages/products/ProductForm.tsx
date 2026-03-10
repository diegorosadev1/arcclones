import { ProductFormLayout } from "@/src/components/admin/products/ProductFormLayout";
import { useProductStore } from "@/src/store/useProductStore";
import React, { useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export function ProductForm() {
  const { id } = useParams();
  const { products, fetchProducts } = useProductStore();

  const mode = id
    ? window.location.pathname.includes("editar")
      ? "edit"
      : "view"
    : "create";

  const product = useMemo(
    () => products.find((p) => p.id === id),
    [id, products],
  );

  useEffect(() => {
    if (!products.length) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  if ((mode === "view" || mode === "edit") && !product) {
    return (
      <div className="text-center py-24 space-y-6">
        <h2 className="text-3xl font-display font-bold">
          Produto não encontrado
        </h2>
        <Link to="/admin/produtos" className="btn-primary inline-flex">
          Voltar para a Lista
        </Link>
      </div>
    );
  }

  return <ProductFormLayout mode={mode as any} initialData={product} />;
}
