/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProductCard } from '@/src/components/ProductCard';
import { Product } from '@/src/types';
import React from 'react';


interface ProductPreviewCardProps {
  product: Partial<Product>;
}

export function ProductPreviewCard({ product }: ProductPreviewCardProps) {
  // Fill missing fields with defaults for preview
  const previewProduct: Product = {
    id: 'preview',
    name: product.name || 'Nome do Produto',
    brand: product.brand || 'Marca',
    category: product.category || 'Watches',
    price: product.price || 0,
    promoPrice: product.promoPrice,
    description: product.description || '',
    images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
    rating: product.rating || 4.5,
    stock: product.stock || 0,
    sku: product.sku || 'LX-00000',
    material: product.material || '',
    color: product.color || '',
    featured: product.featured || false,
    newArrival: product.newArrival || false,
    bestSeller: product.bestSeller || false,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold">Preview na Loja</h3>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Como o cliente verá este produto</p>
      </div>
      
      <div className="max-w-sm mx-auto">
        <ProductCard product={previewProduct} />
      </div>
    </div>
  );
}
