/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product, Category } from '../../../types';
import { clsx } from 'clsx';
import { Star } from 'lucide-react';

interface ProductInfoFieldsProps {
  formData: Partial<Product>;
  onChange: (fields: Partial<Product>) => void;
  mode: 'view' | 'edit' | 'create';
  activeTab: 'info' | 'specs' | 'seo';
}

export function ProductInfoFields({ formData, onChange, mode, activeTab }: ProductInfoFieldsProps) {
  const categories: Category[] = ['Watches', 'Shoulder Bags', 'Glasses', 'Jewelry'];
  const isDisabled = mode === 'view';

  if (activeTab === 'info') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nome do Produto</label>
            <input 
              type="text" 
              disabled={isDisabled}
              value={formData.name || ''}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white" 
              placeholder="Ex: Onyx Stealth Watch"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Marca</label>
            <input 
              type="text" 
              disabled={isDisabled}
              value={formData.brand || ''}
              onChange={(e) => onChange({ brand: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white" 
              placeholder="Ex: AURA"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Categoria</label>
            <select 
              disabled={isDisabled}
              value={formData.category || 'Watches'}
              onChange={(e) => onChange({ category: e.target.value as Category })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">SKU</label>
            <input 
              type="text" 
              disabled={isDisabled}
              value={formData.sku || ''}
              onChange={(e) => onChange({ sku: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white" 
              placeholder="Ex: LX-12345"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preço Base (R$)</label>
            <input 
              type="number" 
              disabled={isDisabled}
              value={formData.price || ''}
              onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preço Promocional (R$)</label>
            <input 
              type="number" 
              disabled={isDisabled}
              value={formData.promoPrice || ''}
              onChange={(e) => onChange({ promoPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estoque Atual</label>
            <input 
              type="number" 
              disabled={isDisabled}
              value={formData.stock || 0}
              onChange={(e) => onChange({ stock: parseInt(e.target.value) || 0 })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white" 
            />
          </div>
          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                disabled={isDisabled}
                checked={formData.featured || false}
                onChange={(e) => onChange({ featured: e.target.checked })}
                className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 text-accent focus:ring-accent disabled:opacity-50" 
              />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Destacar Produto</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Descrição Completa</label>
          <textarea 
            disabled={isDisabled}
            value={formData.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={6}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white resize-none" 
            placeholder="Descreva os detalhes luxuosos deste produto..."
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'specs') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Material</label>
            <input 
              type="text" 
              disabled={isDisabled}
              value={formData.material || ''}
              onChange={(e) => onChange({ material: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white" 
              placeholder="Ex: Aço Inoxidável 316L"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cor</label>
            <input 
              type="text" 
              disabled={isDisabled}
              value={formData.color || ''}
              onChange={(e) => onChange({ color: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white" 
              placeholder="Ex: Preto Fosco"
            />
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Preview das Especificações</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Material</p>
              <p className="text-white font-bold">{formData.material || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Cor</p>
              <p className="text-white font-bold">{formData.color || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'seo') {
    return (
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Meta Title</label>
            <input 
              type="text" 
              disabled={isDisabled}
              placeholder={formData.name || 'Título da página'}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Meta Description</label>
            <textarea 
              disabled={isDisabled}
              rows={4}
              placeholder={formData.description?.slice(0, 160) || 'Breve descrição para o Google...'}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50 text-white resize-none" 
            />
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Preview Google</h4>
            <div className="space-y-1">
              <p className="text-blue-400 text-lg hover:underline cursor-pointer">{formData.name || 'Produto'} | ARC CLONES Premium</p>
              <p className="text-emerald-500 text-xs">https://arcclones.com/produto/{formData.sku?.toLowerCase() || 'sku'}</p>
              <p className="text-zinc-500 text-xs line-clamp-2">{formData.description || 'Descrição do produto para os resultados de busca.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
