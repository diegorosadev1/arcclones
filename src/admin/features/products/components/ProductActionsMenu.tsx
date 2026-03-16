import { MoreVertical, Eye, Edit, Star, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductActionsMenuProps {
  productId: string;
  featured?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onToggleFeatured: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
}

export function ProductActionsMenu({
  productId,
  featured = false,
  isOpen,
  onToggle,
  onClose,
  onView,
  onEdit,
  onToggleFeatured,
  onDelete,
}: ProductActionsMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="p-2 text-zinc-500 hover:text-white transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={onClose} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden"
            >
              <button
                onClick={() => {
                  onView();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
              >
                <Eye size={14} /> Visualizar
              </button>

              <button
                onClick={() => {
                  onEdit();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
              >
                <Edit size={14} /> Editar
              </button>

              <button
                onClick={async () => {
                  await onToggleFeatured();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
              >
                <Star size={14} /> {featured ? "Remover Destaque" : "Destacar"}
              </button>

              <div className="h-px bg-zinc-800" />

              <button
                onClick={async () => {
                  await onDelete();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}