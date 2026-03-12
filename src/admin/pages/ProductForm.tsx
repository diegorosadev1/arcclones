/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { ProductFormLayout } from '../../components/admin/products/ProductFormLayout';

export function ProductForm() {
  const { id } = useParams();
  const { products } = useProductStore();
  
  const mode = id ? (window.location.pathname.includes('editar') ? 'edit' : 'view') : 'create';
  const product = useMemo(() => products.find(p => p.id === id), [id, products]);

  if ((mode === 'view' || mode === 'edit') && !product) {
    return (
      <div className="text-center py-24 space-y-6">
        <h2 className="text-3xl font-display font-bold">Produto não encontrado</h2>
        <Link to="/admin/produtos" className="btn-primary inline-flex">Voltar para a Lista</Link>
      </div>
    );
  }

  return <ProductFormLayout mode={mode as any} initialData={product} />;
}
