/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function Toaster() {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="pointer-events-auto bg-luxury-card border border-zinc-800 rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[300px]"
          >
            <div className={
              n.type === 'success' ? 'text-emerald-500' :
              n.type === 'error' ? 'text-red-500' : 'text-blue-500'
            }>
              {n.type === 'success' && <CheckCircle size={20} />}
              {n.type === 'error' && <XCircle size={20} />}
              {n.type === 'info' && <Info size={20} />}
            </div>
            <p className="text-sm font-medium text-zinc-200 flex-grow">{n.message}</p>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
