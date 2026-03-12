/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Save,
  X,
  Trash2,
  Edit,
  LayoutGrid,
  Settings,
  Search,
  AlertCircle,
} from "lucide-react";
import { Product } from "../../../types";
import { useProductStore } from "../../../store/useProductStore";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfoFields } from "./ProductInfoFields";
import { ProductPreviewCard } from "./ProductPreviewCard";
import { motion, AnimatePresence } from "motion/react";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { supabase } from "../../../lib/supabase";

interface ProductFormLayoutProps {
  mode: "view" | "edit" | "create";
  initialData?: Product;
}

export function ProductFormLayout({
  mode,
  initialData,
}: ProductFormLayoutProps) {
  const navigate = useNavigate();
  const { createProduct, updateProduct, deleteProduct } = useProductStore();

  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: "",
      brand: "",
      category: "Watches",
      price: 0,
      promoPrice: undefined,
      description: "",
      images: [],
      rating: 4.5,
      stock: 0,
      sku: `LX-${Math.floor(Math.random() * 90000) + 10000}`,
      material: "",
      color: "",
      featured: false,
      newArrival: true,
      bestSeller: false,
    },
  );

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"info" | "specs" | "seo">("info");
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: string[] = [];

    if (!formData.name) newErrors.push("Nome do produto é obrigatório");
    if (!formData.price || formData.price <= 0) {
      newErrors.push("Preço deve ser maior que zero");
    }
    if (!formData.category) newErrors.push("Categoria é obrigatória");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (mode === "create") {
      await createProduct(formData as Omit<Product, "id">);
      toast.success("Produto criado com sucesso");
    } else if (mode === "edit" && initialData?.id) {
      await updateProduct(initialData.id, formData);
      toast.success("Produto atualizado com sucesso");
    }

    navigate("/admin/produtos");
  };

  const handleDelete = async () => {
    if (
      initialData?.id &&
      confirm("Tem certeza que deseja excluir este produto?")
    ) {
      await deleteProduct(initialData.id);
      toast.success("Produto removido com sucesso");
      navigate("/admin/produtos");
    }
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

  return (
    <div className="space-y-12 pb-24">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/produtos")}
            className="p-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold">
              {mode === "create"
                ? "Novo Produto"
                : mode === "edit"
                  ? "Editar Produto"
                  : "Detalhes do Produto"}
            </h1>

            <p className="text-zinc-500 text-sm">
              {mode === "create"
                ? "Cadastre um novo item no catálogo."
                : `Gerenciando: ${formData.name}`}
            </p>

            {isUploading && (
              <p className="text-xs text-amber-400">Enviando imagem...</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {mode === "view" ? (
            <>
              <button
                onClick={handleDelete}
                className="p-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-colors"
              >
                <Trash2 size={20} />
              </button>

              <button
                onClick={() =>
                  navigate(`/admin/produtos/${initialData?.id}/editar`)
                }
                className="btn-outline px-8 py-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Edit size={20} /> Editar Produto
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/admin/produtos")}
                className="p-4 rounded-xl border border-zinc-800 text-zinc-500 hover:bg-zinc-900 transition-colors"
              >
                <X size={20} />
              </button>

              <button
                onClick={handleSave}
                disabled={isUploading}
                className="btn-primary px-8 py-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {mode === "create" ? "Criar Produto" : "Salvar Alterações"}
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4"
          >
            <AlertCircle className="text-red-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-500">
                Por favor, corrija os seguintes erros:
              </p>
              <ul className="text-xs text-red-400 list-disc pl-4">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <ProductImageGallery
          images={formData.images || []}
          activeImage={activeImage}
          onActiveImageChange={setActiveImage}
          onAddImage={handleAddImageClick}
          onRemoveImage={handleRemoveImage}
          mode={mode}
        />

        <div className="space-y-8">
          <div className="flex border-b border-zinc-800">
            {[
              { id: "info", label: "Informações", icon: LayoutGrid },
              { id: "specs", label: "Especificações", icon: Settings },
              { id: "seo", label: "SEO", icon: Search },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "info" | "specs" | "seo")}
                className={clsx(
                  "flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border-b-2",
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-zinc-500 hover:text-zinc-300",
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-card p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <ProductInfoFields
                  formData={formData}
                  onChange={(fields) =>
                    setFormData((prev) => ({ ...prev, ...fields }))
                  }
                  mode={mode}
                  activeTab={activeTab}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-zinc-800">
        <ProductPreviewCard product={formData} />
      </div>
    </div>
  );
}