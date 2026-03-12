/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  Settings,
  ShieldCheck,
  CreditCard,
  Bell,
  Loader2,
  Camera,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { useProductStore } from "../store/useProductStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { ProductCard } from "../components/ProductCard";
import { OrderDetails } from "../components/account/orders/OrderDetails";
import { OrderTracking } from "../components/account/orders/OrderTracking";
import { AddressModal } from "../components/account/AddressModal";
import { useAddressStore } from "../store/useAddressStore";
import { Address } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { clsx } from "clsx";
import { useOrderStore } from "../store/useOrderStore";

type Tab = "profile" | "orders" | "addresses" | "wishlist" | "security";

type AddressFormData = Omit<
  Address,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export function Account() {
  const { addNotification } = useStore();
  const { profile, user, loading, signOut, updatePassword, updateProfile } =
    useAuth();
  const { products } = useProductStore();
  const { wishlist } = useWishlistStore();
  const {
    orders,
    isLoading: isOrdersLoading,
    error: ordersError,
    fetchOrders,
  } = useOrderStore();
  const {
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress,
  } = useAddressStore();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(
    undefined,
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const wishlistProducts = (Array.isArray(products) ? products : []).filter(
    (p) => (wishlist || []).includes(p?.id),
  );

  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      fetchOrders(profile.id);
      fetchAddresses(profile.id);
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile, fetchOrders, fetchAddresses]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await updateProfile({ name, email });
      if (error) throw error;
      addNotification("Perfil atualizado com sucesso!", "success");
    } catch (error: any) {
      console.error("Profile update error:", error);
      addNotification(error.message || "Erro ao atualizar perfil", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await updateProfile({ avatar: publicUrl });
      if (updateError) throw updateError;

      addNotification("Foto de perfil atualizada!", "success");
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      addNotification(error.message || "Erro ao carregar foto", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerifyCurrentPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !profile?.email) return;

    setIsVerifying(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: currentPassword,
      });

      if (error) {
        throw new Error("Senha atual incorreta.");
      }

      setIsCurrentPasswordVerified(true);
      addNotification("Senha atual verificada!", "success");
    } catch (error: any) {
      addNotification(error.message || "Erro ao verificar senha", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      addNotification("As senhas não coincidem", "error");
      return;
    }

    if (newPassword.length < 6) {
      addNotification("A senha deve ter pelo menos 6 caracteres", "error");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;

      addNotification("Senha alterada com sucesso!", "success");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setIsCurrentPasswordVerified(false);
    } catch (error: any) {
      console.error("Password change error:", error);
      addNotification(error.message || "Erro ao alterar senha", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressSubmit = async (formData: AddressFormData) => {
    if (!user) return;

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, {
          ...formData,
          user_id: user.id,
        });
        addNotification("Endereço atualizado com sucesso!", "success");
      } else {
        await addAddress({
          ...formData,
          user_id: user.id,
        });
        addNotification("Endereço adicionado com sucesso!", "success");
      }
    } catch (error: any) {
      console.error("Address operation error:", error);
      addNotification(error.message || "Erro ao salvar endereço", "error");
      throw error;
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este endereço?")) {
      try {
        await deleteAddress(id);
        addNotification("Endereço excluído com sucesso!", "success");
      } catch (error: any) {
        console.error("Delete address error:", error);
        addNotification(error.message || "Erro ao excluir endereço", "error");
      }
    }
  };

  const handleSetPrimaryAddress = async (id: string) => {
    if (!user) return;

    try {
      await setPrimaryAddress(id, user.id);
      addNotification("Endereço principal atualizado!", "success");
    } catch (error: any) {
      console.error("Set primary address error:", error);
      addNotification(
        error.message || "Erro ao definir endereço principal",
        "error",
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      addNotification("Você saiu da sua conta", "info");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      addNotification("Erro ao sair da conta", "error");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-luxury-black">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Carregando sua conta...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-luxury-black">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Carregando perfil...
        </p>
      </div>
    );
  }

  const menuItems: { id: Tab; label: string; icon: any }[] = [
    { id: "profile", label: "Meu Perfil", icon: User },
    { id: "orders", label: "Meus Pedidos", icon: Package },
    { id: "addresses", label: "Endereços", icon: MapPin },
    { id: "wishlist", label: "Favoritos", icon: Heart },
  ];

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-72 space-y-8">
          <div className="glass-card p-6 flex items-center gap-4 relative group">
            <div className="relative">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-display font-bold text-2xl overflow-hidden border-2 border-zinc-800">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center cursor-pointer border border-zinc-700 hover:bg-accent transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <Loader2 size={12} className="animate-spin text-white" />
                ) : (
                  <Camera size={12} className="text-white" />
                )}
              </label>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">{profile.name}</h2>
              <p className="text-xs text-zinc-500">{profile.email}</p>
            </div>
          </div>

          <nav className="glass-card overflow-hidden">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={clsx(
                  "w-full flex items-center gap-4 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-l-4",
                  activeTab === item.id
                    ? "bg-accent/5 border-accent text-accent"
                    : "border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300",
                )}
              >
                <item.icon size={18} />
                {item.label}
                <ChevronRight size={14} className="ml-auto opacity-50" />
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all duration-300 border-l-4 border-transparent"
            >
              <LogOut size={18} />
              Sair da Conta
            </button>
          </nav>

          <div className="glass-card p-6 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Configurações
            </h4>
            <div className="space-y-3">
              <button className="flex items-center gap-3 text-xs text-zinc-400 hover:text-white transition-colors">
                <Settings size={14} /> Preferências
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={clsx(
                  "flex items-center gap-3 text-xs transition-colors",
                  activeTab === "security"
                    ? "text-accent"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                <ShieldCheck size={14} /> Segurança
              </button>
              <button className="flex items-center gap-3 text-xs text-zinc-400 hover:text-white transition-colors">
                <CreditCard size={14} /> Cartões Salvos
              </button>
              <button className="flex items-center gap-3 text-xs text-zinc-400 hover:text-white transition-colors">
                <Bell size={14} /> Notificações
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-grow">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-12 min-h-[600px]"
          >
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold">
                    Meu Perfil
                  </h2>
                  <p className="text-zinc-500">
                    Gerencie suas informações pessoais e de contato.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      CPF
                    </label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary px-8 py-3 text-sm uppercase tracking-widest font-bold disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "Salvar Alterações"
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "orders" && (
              <div className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold">
                    Meus Pedidos
                  </h2>
                  <p className="text-zinc-500">
                    Acompanhe o status e histórico de suas compras.
                  </p>
                </div>

                {isOrdersLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-accent animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Carregando pedidos...
                    </p>
                  </div>
                ) : ordersError ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
                    <p className="text-zinc-500">
                      Erro ao carregar pedidos. Tente novamente.
                    </p>
                    <button
                      onClick={() => profile && fetchOrders(profile.id)}
                      className="btn-primary px-6 py-2"
                    >
                      Recarregar
                    </button>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                              Pedido #{order.orderNumber}
                            </p>
                            <p className="text-sm font-bold">
                              Realizado em{" "}
                              {new Date(order.date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>

                          <div
                            className={clsx(
                              "px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                              order.status === "Delivered"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : order.status === "Cancelled"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-blue-500/10 text-blue-500",
                            )}
                          >
                            {order.status}
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                              Total
                            </p>
                            <p className="text-lg font-bold text-accent">
                              R${" "}
                              {order.total.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="w-16 h-16 rounded-lg bg-zinc-800 border border-zinc-700 flex-shrink-0 overflow-hidden"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setSelectedOrderId(order.id)}
                            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                          >
                            Ver Detalhes
                          </button>

                          {order.status !== "Cancelled" && (
                            <button
                              onClick={() => setTrackingOrderId(order.id)}
                              className="text-xs font-bold uppercase tracking-widest text-accent hover:underline"
                            >
                              Rastrear Objeto
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 space-y-4">
                    <Package size={48} className="mx-auto text-zinc-800" />
                    <p className="text-zinc-500">
                      Você ainda não realizou nenhum pedido.
                    </p>
                    <Link
                      to="/catalog"
                      className="btn-primary inline-flex px-8 py-3"
                    >
                      Ir para a Loja
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-bold">
                      Endereços
                    </h2>
                    <p className="text-zinc-500">
                      Gerencie seus locais de entrega salvos.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingAddress(undefined);
                      setIsAddressModalOpen(true);
                    }}
                    className="btn-outline px-6 py-2 text-xs font-bold uppercase tracking-widest"
                  >
                    Novo Endereço
                  </button>
                </div>

                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={clsx(
                          "p-6 rounded-2xl border-2 space-y-4 relative transition-all",
                          address.is_default
                            ? "border-accent bg-accent/5"
                            : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700",
                        )}
                      >
                        {address.is_default && (
                          <div className="absolute top-6 right-6 px-2 py-1 rounded bg-accent text-white text-[8px] font-bold uppercase tracking-widest">
                            Principal
                          </div>
                        )}

                        <div
                          className={clsx(
                            "flex items-center gap-3",
                            address.is_default
                              ? "text-accent"
                              : "text-zinc-400",
                          )}
                        >
                          <MapPin size={18} />
                          <h4 className="font-bold text-sm uppercase tracking-widest">
                            {address.label}
                          </h4>
                        </div>

                        <div className="space-y-1 text-sm text-zinc-300">
                          <p>{address.recipient_name}</p>
                          <p>{address.phone}</p>
                          <p>
                            {address.street}, {address.number}
                            {address.complement
                              ? ` - ${address.complement}`
                              : ""}
                          </p>
                          <p>
                            {address.neighborhood}, {address.city} -{" "}
                            {address.state}
                          </p>
                          <p>{address.country}</p>
                          <p>CEP: {address.zip_code}</p>
                        </div>

                        <div className="flex gap-4 pt-2">
                          <button
                            onClick={() => {
                              setEditingAddress(address);
                              setIsAddressModalOpen(true);
                            }}
                            className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                          >
                            Excluir
                          </button>

                          {!address.is_default && (
                            <button
                              onClick={() => handleSetPrimaryAddress(address.id)}
                              className="text-xs font-bold uppercase tracking-widest text-accent hover:underline ml-auto"
                            >
                              Tornar Principal
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 space-y-4">
                    <MapPin size={48} className="mx-auto text-zinc-800" />
                    <p className="text-zinc-500">
                      Você ainda não cadastrou nenhum endereço.
                    </p>
                    <button
                      onClick={() => {
                        setEditingAddress(undefined);
                        setIsAddressModalOpen(true);
                      }}
                      className="btn-primary inline-flex px-8 py-3"
                    >
                      Adicionar Endereço
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold">Favoritos</h2>
                  <p className="text-zinc-500">
                    Seus itens de desejo salvos para mais tarde.
                  </p>
                </div>

                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 space-y-4">
                    <Heart size={48} className="mx-auto text-zinc-800" />
                    <p className="text-zinc-500">
                      Você ainda não tem favoritos.{" "}
                      <Link
                        to="/catalog"
                        className="text-accent hover:underline"
                      >
                        Explorar Catálogo
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold">Segurança</h2>
                  <p className="text-zinc-500">
                    Mantenha sua conta protegida alterando sua senha
                    regularmente.
                  </p>
                </div>

                {!isCurrentPasswordVerified ? (
                  <form
                    onSubmit={handleVerifyCurrentPassword}
                    className="max-w-md space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Senha Atual
                      </label>

                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="Digite sua senha atual"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying || !currentPassword}
                      className="btn-primary w-full py-4 uppercase tracking-widest text-sm font-bold disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        "Verificar Senha"
                      )}
                    </button>
                  </form>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleChangePassword}
                    className="max-w-md space-y-6"
                  >
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium mb-6">
                      Senha atual verificada com sucesso. Agora você pode
                      definir uma nova senha.
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800 flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCurrentPasswordVerified(false);
                          setCurrentPassword("");
                        }}
                        className="btn-outline flex-1 py-4 uppercase tracking-widest text-sm font-bold"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-primary flex-[2] py-4 uppercase tracking-widest text-sm font-bold disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                          "Alterar Senha"
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </div>
            )}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {isAddressModalOpen && (
          <AddressModal
            isOpen={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            onSubmit={handleAddressSubmit}
            initialData={editingAddress}
            title={editingAddress ? "Editar Endereço" : "Novo Endereço"}
          />
        )}

        {selectedOrderId && (
          <OrderDetails
            orderId={selectedOrderId}
            onClose={() => setSelectedOrderId(null)}
          />
        )}

        {trackingOrderId && (
          <OrderTracking
            orderId={trackingOrderId}
            onClose={() => setTrackingOrderId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}