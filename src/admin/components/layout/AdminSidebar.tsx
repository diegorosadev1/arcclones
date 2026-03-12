/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/src/contexts/AuthContext";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "products",
      label: "Produtos",
      icon: Package,
      path: "/admin/produtos",
    },
    {
      id: "orders",
      label: "Pedidos",
      icon: ShoppingBag,
      path: "/admin/pedidos",
    },
    {
      id: "users",
      label: "Usuários",
      icon: Users,
      path: "/admin/usuarios",
    },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      path: "/admin/configuracoes",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  };

  return (
    <aside className="w-64 h-screen bg-luxury-black border-r border-zinc-800 fixed left-0 top-0 z-50 flex flex-col">
      <div className="flex flex-col p-6 border-b border-zinc-800 items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/img/logo.png"
            alt="Arc Clones Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        <span className="font-display font-bold text-xl tracking-tight text-white text-center">
          <span className="text-accent text-xs uppercase tracking-widest ml-1">
            Painel Administrativo
          </span>
        </span>
      </div>

      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 mb-4">
          Menu Principal
        </div>

        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={clsx(
                "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300",
                isActive
                  ? "bg-accent/10 text-accent shadow-[0_0_15px_rgba(225,29,72,0.1)]"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300",
              )}
            >
              <item.icon size={18} />
              {item.label}
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-all duration-300"
        >
          <ExternalLink size={18} />
          Ver Loja
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all duration-300"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}