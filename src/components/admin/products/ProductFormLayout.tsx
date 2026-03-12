/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  X, 
  Trash2, 
  Edit,
  LayoutGrid,
  Settings,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Product } from '../../../types';
import { useProductStore } from '../../../store/useProductStore';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductInfoFields } from './ProductInfoFields';
import { ProductPreviewCard } from './ProductPreviewCard';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

interface ProductFormLayoutProps {
  mode: 'view' | 'edit' | 'create';
  initialData?: Product;
}

export function ProductFormLayout({ mode, initialData }: ProductFormLayoutProps) {
  const navigate = useNavigate();
  const { createProduct, updateProduct, deleteProduct, isLoading: isStoreLoading } = useProductStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>(initialData || {
    name: '',
    brand: '',
    category: 'Watches',
    price: 0,
    promoPrice: undefined,
    description: '',
    images: [],
    rating: 4.5,
    stock: 0,
    sku: `LX-${Math.floor(Math.random() * 90000) + 10000}`,
    material: '',
    color: '',
    featured: false,
    newArrival: true,
    bestSeller: false,
  });

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'seo'>('info');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!formData.name) newErrors.push('Nome do produto é obrigatório');
    if (!formData.price || formData.price <= 0) newErrors.push('Preço deve ser maior que zero');
    if (!formData.category) newErrors.push('Categoria é obrigatória');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await createProduct(formData as Omit<Product, 'id'>);
      } else if (mode === 'edit' && initialData?.id) {
        await updateProduct(initialData.id, formData);
      }
      navigate('/admin/produtos');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (initialData?.id && confirm('Tem certeza que deseja excluir este produto?')) {
      setIsSubmitting(true);
      try {
        await deleteProduct(initialData.id);
        navigate('/admin/produtos');
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAddImage = () => {
    const url = prompt('Insira a URL da imagem:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
    if (activeImage >= (formData.images?.length || 1) - 1) {
      setActiveImage(Math.max(0, (formData.images?.length || 1) - 2));
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/produtos')} className="p-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold">
              {mode === 'create' ? 'Novo Produto' : mode === 'edit' ? 'Editar Produto' : 'Detalhes do Produto'}
            </h1>
            <p className="text-zinc-500 text-sm">
              {mode === 'create' ? 'Cadastre um novo item no catálogo.' : `Gerenciando: ${formData.name}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {mode === 'view' ? (
            <>
              <button 
                onClick={handleDelete} 
                disabled={isSubmitting}
                className="p-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
              </button>
              <button 
                onClick={() => navigate(`/admin/produtos/${initialData?.id}/editar`)} 
                className="btn-outline px-8 py-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Edit size={20} /> Editar Produto
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/admin/produtos')} 
                disabled={isSubmitting}
                className="p-4 rounded-xl border border-zinc-800 text-zinc-500 hover:bg-zinc-900 transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSubmitting}
                className="btn-primary px-8 py-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={20} />}
                {mode === 'create' ? 'Criar Produto' : 'Salvar Alterações'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Validation Errors */}
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
              <p className="text-sm font-bold text-red-500">Por favor, corrija os seguintes erros:</p>
              <ul className="text-xs text-red-400 list-disc pl-4">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column: Visual Preview (Public Style) */}
        <ProductImageGallery 
          images={formData.images || []}
          activeImage={activeImage}
          onActiveImageChange={setActiveImage}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          mode={mode}
        />

        {/* Right Column: Form Inputs */}
        <div className="space-y-8">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800">
            {[
              { id: 'info', label: 'Informações', icon: LayoutGrid },
              { id: 'specs', label: 'Especificações', icon: Settings },
              { id: 'seo', label: 'SEO', icon: Search },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border-b-2",
                  activeTab === tab.id ? "border-accent text-accent" : "border-transparent text-zinc-500 hover:text-zinc-300"
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
                  onChange={(fields) => setFormData(prev => ({ ...prev, ...fields }))}
                  mode={mode}
                  activeTab={activeTab}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Preview */}
      <div className="pt-12 border-t border-zinc-800">
        <ProductPreviewCard product={formData} />
      </div>
    </div>
  );
}
