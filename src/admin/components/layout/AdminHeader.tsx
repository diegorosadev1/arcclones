/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Bell, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";

export function AdminHeader() {
  const { profile } = useAuth();

  const displayName = profile?.name || "Administrador";
  const displayRole = profile?.role || "admin";
  const avatar = profile?.avatar || "";

  return (
    <header className="h-20 bg-luxury-black/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40 flex items-center justify-between px-8">
      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />
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
            <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">
              {displayName}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {displayRole}
            </p>
          </div>

          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 group-hover:border-accent transition-colors bg-zinc-900 flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={18} className="text-zinc-400" />
              )}
            </div>
          </div>

          <ChevronDown
            size={16}
            className="text-zinc-500 group-hover:text-white transition-colors"
          />
        </div>
      </div>
    </header>
  );
}