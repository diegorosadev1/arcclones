/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';

export function CheckoutSuccess() {
  const { clearCart, addNotification } = useStore();

  useEffect(() => {
    clearCart();
    addNotification('Pagamento realizado com sucesso!', 'success');
  }, [clearCart, addNotification]);

  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle size={64} />
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-4xl font-display font-bold">Pedido Confirmado!</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          Seu pagamento foi recebido com sucesso. Em breve você poderá acompanhar
          o pedido na sua conta.
        </p>
        <p className="text-xs text-zinc-600">
          Você já pode verificar seus pedidos na área da conta.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/account" className="btn-outline px-10 py-4">
          Ver Meus Pedidos
        </Link>
        <Link to="/" className="btn-primary px-10 py-4">
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}