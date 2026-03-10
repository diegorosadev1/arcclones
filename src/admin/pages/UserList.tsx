/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  UserX, 
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';
import { useAdminUsersStore } from '../stores/useAdminUsersStore';
import { DataTable } from '../components/DataTable';
import { Customer } from '../types';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

export function UserList() {
  const { users, isLoading, toggleUserStatus } = useAdminUsersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const columns = [
    {
      header: 'Cliente',
      accessor: (u: Customer) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <img src={u.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} alt={u.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <p className="font-bold text-white">{u.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cadastrado em {new Date(u.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contato',
      accessor: (u: Customer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Mail size={12} className="text-zinc-600" /> {u.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Phone size={12} className="text-zinc-600" /> {u.phone}
          </div>
        </div>
      ),
    },
    {
      header: 'Pedidos',
      accessor: (u: Customer) => (
        <div className="space-y-1">
          <p className="font-bold text-white">{u.totalOrders} pedidos</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Último: {u.lastOrderDate ? new Date(u.lastOrderDate).toLocaleDateString('pt-BR') : 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Total Gasto',
      accessor: (u: Customer) => (
        <p className="font-bold text-accent">R$ {u.totalSpent.toLocaleString('pt-BR')}</p>
      ),
    },
    {
      header: 'Status',
      accessor: (u: Customer) => (
        <span className={clsx(
          "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
          u.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
        )}>
          {u.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      header: 'Ações',
      accessor: (u: Customer) => (
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === u.id ? null : u.id);
            }}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          
          <AnimatePresence>
            {activeMenu === u.id && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden"
                >
                  <button 
                    onClick={() => setActiveMenu(null)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <Eye size={14} /> Perfil Completo
                  </button>
                  <button 
                    onClick={() => setActiveMenu(null)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <Edit size={14} /> Editar Dados
                  </button>
                  <div className="h-px bg-zinc-800" />
                  <button 
                    onClick={() => {
                      toggleUserStatus(u.id);
                      setActiveMenu(null);
                    }}
                    className={clsx(
                      "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all",
                      u.status === 'active' ? "text-red-500 hover:bg-red-500/5" : "text-emerald-500 hover:bg-emerald-500/5"
                    )}
                  >
                    {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    {u.status === 'active' ? 'Desativar Usuário' : 'Ativar Usuário'}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Usuários</h1>
          <p className="text-zinc-500 text-sm">Gerencie seus clientes e base de usuários.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="relative w-full lg:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors text-zinc-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
            <Filter size={16} className="text-zinc-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-zinc-300 cursor-pointer"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          <div className="h-8 w-px bg-zinc-800 hidden lg:block" />

          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Total: <span className="text-white">{filteredUsers.length} clientes</span>
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredUsers} 
        isLoading={isLoading}
      />

      {/* Pagination Mock */}
      <div className="flex items-center justify-between text-zinc-500">
        <p className="text-xs font-bold uppercase tracking-widest">Página 1 de 1</p>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors disabled:opacity-30" disabled>
            <ChevronLeft size={18} />
          </button>
          <button className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors disabled:opacity-30" disabled>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
