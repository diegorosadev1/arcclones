import { useNavigate } from "react-router-dom";
import { useProductForm } from "../../hooks/useProductForm";
import { ProductFormPage } from "../../components/ProductFormPage";
import { ProductFormFields } from "../../components/ProductFormFields";

export function ProductCreatePage() {
  const navigate = useNavigate();

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
    mode: "create",
    onSuccess: () => navigate("/admin/produtos"),
  });

  return (
    <ProductFormPage
      title="Novo Produto"
      description="Cadastre um novo item no catálogo."
      tag="Modo criação"
      mode="create"
      onSave={handleSave}
      isUploading={isUploading}
    >
      <ProductFormFields
        mode="create"
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