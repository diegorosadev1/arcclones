import { ProductFormFields } from "../../components/ProductFormFields";
import { ProductFormPage } from "../../components/ProductFormPage";
import { useProductPageData } from "../../hooks/useProductPageData";

export function ProductViewPage() {
  const { product, isLoading, error, notFound } = useProductPageData({
    mode: "view",
  });

  return (
    <ProductFormPage
      title="Detalhes do Produto"
      description={product ? `Visualizando: ${product.name}` : undefined}
      tag="Modo visualização"
      mode="view"
      product={product}
      isLoading={isLoading}
      error={error}
      notFound={notFound}
    >
      {product && (
        <ProductFormFields
          mode="view"
          formData={product}
          setFormData={() => {}}
          activeImage={0}
          setActiveImage={() => {}}
          activeTab="info"
          setActiveTab={() => {}}
          errors={[]}
          fileInputRef={undefined as any}
          handleFileChange={() => {}}
          handleAddImageClick={() => {}}
          handleRemoveImage={() => {}}
        />
      )}
    </ProductFormPage>
  );
}