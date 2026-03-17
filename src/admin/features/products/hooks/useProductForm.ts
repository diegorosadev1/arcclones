import { React, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { Product } from "../../../../types";
import { useProductStore } from "../../../../store/useProductStore";
import { supabase } from "../../../../lib/supabase";
import {
  getEmptyProduct,
  validateProductForm,
} from "../utils/productForm.helpers";

interface UseProductFormProps {
  mode: "view" | "edit" | "create";
  initialData?: Product;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export function useProductForm({
  mode,
  initialData,
  onSuccess,
  onDeleteSuccess,
}: UseProductFormProps) {
  const { createProduct, updateProduct, deleteProduct } = useProductStore();

  const [formData, setFormData] = useState<Partial<Product>>(getEmptyProduct());
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"info" | "specs" | "seo">("info");
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mode === "create") {
      setFormData(getEmptyProduct());
      setActiveImage(0);
      setErrors([]);
      return;
    }

    if (initialData) {
      setFormData(initialData);
      setActiveImage(0);
      setErrors([]);
    }
  }, [mode, initialData]);

  const validate = () => {
    const newErrors = validateProductForm(formData);
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return false;

    try {
      if (mode === "create") {
        const created = await createProduct(formData as Omit<Product, "id">);

        if (!created) {
          toast.error("Erro ao criar produto");
          return false;
        }

        toast.success("Produto criado com sucesso");
        
      } else if (mode === "edit" && initialData?.id) {
        const updated = await updateProduct(initialData.id, formData);

        if (!updated) {
          toast.error("Erro ao atualizar produto");
          return false;
        }

        toast.success("Produto atualizado com sucesso");
      }

      onSuccess?.();
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o produto");
      return false;
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return false;

    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return false;
    }

    const deleted = await deleteProduct(initialData.id);

    if (!deleted) {
      toast.error("Erro ao remover produto");
      return false;
    }

    toast.success("Produto removido com sucesso");
    onDeleteSuccess?.();
    return true;
  };

  const handleAddImageClick = () => {
    if (mode === "view" || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product_images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product_images")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error("Não foi possível gerar a URL pública da imagem");
      }

      setFormData((prev) => {
        const nextImages = [...(prev.images || []), publicUrl];
        setActiveImage(nextImages.length - 1);

        return {
          ...prev,
          images: nextImages,
        };
      });

      toast.success("Imagem enviada com sucesso");
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      toast.error("Erro ao enviar imagem");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));

    if (activeImage >= (formData.images?.length || 1) - 1) {
      setActiveImage(Math.max(0, (formData.images?.length || 1) - 2));
    }
  };

  return {
    formData,
    setFormData,
    activeImage,
    setActiveImage,
    activeTab,
    setActiveTab,
    errors,
    isUploading,
    fileInputRef,
    handleSave,
    handleDelete,
    handleAddImageClick,
    handleFileChange,
    handleRemoveImage,
  };
}
