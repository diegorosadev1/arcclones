import { useNavigate } from "react-router-dom";
import { useProductForm } from "../../../hooks/useProductForm";
import { ProductFormPage } from "../../../components/ProductFormPage";
import { ProductFormFields } from "../../../components/ProductFormFields";
import { useProductPageData } from "../../../hooks/useProductPageData";

export function ProductEditPage() {
  const navigate = useNavigate();

  const { product, isLoading, error, notFound } = useProductPageData({
    mode: "edit",
  });

  const {
    formData,
    setFormData,
    activeImage,
    setActiveImage,
    activeTab,
    setActiveTab,
    errors,
    fileInputRef,
    isUploading,
    handleFileChange,
    handleAddImageClick,
    handleRemoveImage,
    handleSave,
  } = useProductForm({
    mode: "edit",
    initialData: product,
    onSuccess: () => navigate("/admin/produtos"),
  });

  return (
    <ProductFormPage
      title="Editar Produto"
      description={product ? `Editando: ${product.name}` : undefined}
      tag="Modo edição"
      mode="edit"
      product={product}
      isLoading={isLoading}
      error={error}
      notFound={notFound}
      onSave={handleSave}
      isUploading={isUploading}
    >
      <ProductFormFields
        mode="edit"
        formData={formData}
        setFormData={setFormData}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        errors={errors}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleAddImageClick={handleAddImageClick}
        handleRemoveImage={handleRemoveImage}
      />
    </ProductFormPage>
  );
}