import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Address } from "../../types";
import { motion, AnimatePresence } from "motion/react";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    address: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  initialData?: Address;
  title: string;
}

export function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: AddressModalProps) {
  const [formData, setFormData] = useState({
    label: "",
    recipient_name: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
    zip_code: "",
    is_default: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        label: initialData.label,
        recipient_name: initialData.recipient_name,
        phone: initialData.phone,
        street: initialData.street,
        number: initialData.number,
        complement: initialData.complement || "",
        neighborhood: initialData.neighborhood,
        city: initialData.city,
        state: initialData.state,
        country: initialData.country,
        zip_code: initialData.zip_code,
        is_default: initialData.is_default,
      });
    } else {
      setFormData({
        label: "",
        recipient_name: "",
        phone: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "Brasil",
        zip_code: "",
        is_default: false,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-display font-bold text-xl uppercase tracking-widest">
                {title}
              </h3>

              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* LABEL */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Identificação (ex: Casa, Trabalho)
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* NOME DO DESTINATÁRIO */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Nome do Destinatário
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.recipient_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipient_name: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* TELEFONE */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Telefone
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* CEP */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    CEP
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) =>
                      setFormData({ ...formData, zip_code: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* RUA */}
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Rua
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* NUMERO */}
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Número
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* COMPLEMENTO */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Complemento (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        complement: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* BAIRRO */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Bairro
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        neighborhood: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* CIDADE */}
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Cidade
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* ESTADO */}
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Estado (UF)
                  </label>
                  <input
                    required
                    maxLength={2}
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              {/* DEFAULT */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_default: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-accent focus:ring-accent"
                />

                <label htmlFor="is_default" className="text-xs text-zinc-400">
                  Definir como endereço principal
                </label>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] btn-primary py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Salvar Endereço"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
