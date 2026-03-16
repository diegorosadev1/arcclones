/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

interface ProductImageGalleryProps {
  images: string[];
  activeImage: number;
  onActiveImageChange: (index: number) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  mode: 'view' | 'edit' | 'create';
}

export function ProductImageGallery({ 
  images, 
  activeImage, 
  onActiveImageChange, 
  onAddImage, 
  onRemoveImage,
  mode 
}: ProductImageGalleryProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 relative group"
      >
        {images.length > 0 ? (
          <img
            src={images[activeImage]}
            alt="Product"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
            <ImageIcon size={64} />
            <p className="text-xs font-bold uppercase tracking-widest mt-4">Sem Imagem</p>
          </div>
        )}
        
        {mode !== 'view' && images.length > 0 && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onRemoveImage(activeImage)}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </motion.div>
      
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => onActiveImageChange(i)}
            className={clsx(
              "aspect-square rounded-xl overflow-hidden border-2 transition-all relative group",
              activeImage === i ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"
            )}
          >
            <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </button>
        ))}
        
        {mode !== 'view' && (
          <button 
            onClick={onAddImage}
            className="aspect-square rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 transition-all bg-zinc-900/30"
          >
            <Plus size={24} />
            <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Adicionar</span>
          </button>
        )}
      </div>
    </div>
  );
}
