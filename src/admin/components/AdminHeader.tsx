/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';

export function AdminHeader() {
  const { admin } = useAdminAuthStore();

  return (
    <header className="h-20 bg-luxury-black/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40 flex items-center justify-between px-8">
      <div className="relative w-96">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Busca global (pedidos, produtos, clientes)..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-zinc-300"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>

        <div className="h-8 w-px bg-zinc-800" />

        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">{admin?.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{admin?.role}</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 group-hover:border-accent transition-colors">
              <img 
                src={admin?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                alt={admin?.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <ChevronDown size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
}
