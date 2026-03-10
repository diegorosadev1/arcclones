/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, ChevronRight, Settings, ShieldCheck, CreditCard, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useProductStore } from '../store/useProductStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

type Tab = 'profile' | 'orders' | 'addresses' | 'wishlist';

export function Account() {
  const { user, setUser, addNotification } = useStore();
  const { products } = useProductStore();
  const { wishlist } = useWishlistStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    addNotification('Você saiu da sua conta', 'info');
    navigate('/');
  };

  const menuItems: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'orders', label: 'Meus Pedidos', icon: Package },
    { id: 'addresses', label: 'Endereços', icon: MapPin },
    { id: 'wishlist', label: 'Favoritos', icon: Heart },
  ];

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 space-y-8">
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-display font-bold text-2xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">{user.name}</h2>
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>

          <nav className="glass-card overflow-hidden">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={clsx(
                  "w-full flex items-center gap-4 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-l-4",
                  activeTab === item.id ? "bg-accent/5 border-accent text-accent" : "border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
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
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Configurações</h4>
            <div className="space-y-3">
              <button className="flex items-center gap-3 text-xs text-zinc-400 hover:text-white transition-colors">
                <Settings size={14} /> Preferências
              </button>
              <button className="flex items-center gap-3 text-xs text-zinc-400 hover:text-white transition-colors">
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

        {/* Content */}
        <main className="flex-grow">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-12 min-h-[600px]"
          >
            {activeTab === 'profile' && (
              <div className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold">Meu Perfil</h2>
                  <p className="text-zinc-500">Gerencie suas informações pessoais e de contato.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nome Completo</label>
                    <input type="text" defaultValue={user.name} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">E-mail</label>
                    <input type="email" defaultValue={user.email} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">CPF</label>
                    <input type="text" placeholder="000.000.000-00" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Telefone</label>
                    <input type="text" placeholder="(00) 00000-0000" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" />
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <button className="btn-primary px-8 py-3 text-sm uppercase tracking-widest font-bold">Salvar Alterações</button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold">Meus Pedidos</h2>
                  <p className="text-zinc-500">Acompanhe o status e histórico de suas compras.</p>
                </div>

                <div className="space-y-6">
                  {[1, 2].map((order) => (
                    <div key={order} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pedido #LX-7829{order}</p>
                          <p className="text-sm font-bold">Realizado em 12/03/2026</p>
                        </div>
                        <div className="px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                          Entregue
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total</p>
                          <p className="text-lg font-bold text-accent">R$ 1.250,00</p>
                        </div>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-16 h-16 rounded-lg bg-zinc-800 border border-zinc-700 flex-shrink-0" />
                        ))}
                      </div>
                      <div className="flex justify-end gap-4">
                        <button className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Ver Detalhes</button>
                        <button className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">Rastrear Objeto</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-bold">Endereços</h2>
                    <p className="text-zinc-500">Gerencie seus locais de entrega salvos.</p>
                  </div>
                  <button className="btn-outline px-6 py-2 text-xs font-bold uppercase tracking-widest">Novo Endereço</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl border-2 border-accent bg-accent/5 space-y-4 relative">
                    <div className="absolute top-6 right-6 px-2 py-1 rounded bg-accent text-white text-[8px] font-bold uppercase tracking-widest">Principal</div>
                    <div className="flex items-center gap-3 text-accent">
                      <MapPin size={18} />
                      <h4 className="font-bold text-sm uppercase tracking-widest">Casa</h4>
                    </div>
                    <div className="space-y-1 text-sm text-zinc-300">
                      <p>Rua das Flores, 123 - Apto 45</p>
                      <p>Jardins, São Paulo - SP</p>
                      <p>CEP: 01234-567</p>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Editar</button>
                      <button className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">Excluir</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold">Favoritos</h2>
                  <p className="text-zinc-500">Seus itens de desejo salvos para mais tarde.</p>
                </div>
                
                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 space-y-4">
                    <Heart size={48} className="mx-auto text-zinc-800" />
                    <p className="text-zinc-500">Você ainda não tem favoritos. <Link to="/catalog" className="text-accent hover:underline">Explorar Catálogo</Link></p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
