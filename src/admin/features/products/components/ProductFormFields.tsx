import React from "react";
import { LayoutGrid, Settings, Search, AlertCircle } from "lucide-react";
import { Product } from "../../../../types";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfoFields } from "./ProductInfoFields";
import { ProductPreviewCard } from "./ProductPreviewCard";
import { motion, AnimatePresence } from "motion/react";
import { clsx } from "clsx";

interface ProductFormFieldsProps {
  mode: "view" | "edit" | "create";
  formData: Partial<Product>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  activeImage: number;
  setActiveImage: (value: number) => void;
  activeTab: "info" | "specs" | "seo";
  setActiveTab: (value: "info" | "specs" | "seo") => void;
  errors: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddImageClick: () => void;
  handleRemoveImage: (index: number) => void;
}

export function ProductFormFields({
  mode,
  formData,
  setFormData,
  activeImage,
  setActiveImage,
  activeTab,
  setActiveTab,
  errors,
  fileInputRef,
  handleFileChange,
  handleAddImageClick,
  handleRemoveImage,
}: ProductFormFieldsProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

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
    </>
  );
}