/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
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
  Shield,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';

import { Profile } from '../../../../types';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminUsersStore } from '../store/useAdminUsersStore';
import { DataTable } from '@/src/admin/components/shared/DataTable';

export function UserList() {
  const { users, isLoading, error, fetchUsers, toggleUserStatus } = useAdminUsersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const columns = [
    {
      header: 'Usuário',
      accessor: (u: Profile) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <img 
              src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=18181b&color=fff`} 
              alt={u.name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <p className="font-bold text-white">{u.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Cadastrado em {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : 'N/A'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contato',
      accessor: (u: Profile) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Mail size={12} className="text-zinc-600" /> {u.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Permissão',
      accessor: (u: Profile) => (
        <div className="flex items-center gap-2">
          {u.role === 'admin' ? (
            <Shield size={14} className="text-accent" />
          ) : (
            <UserIcon size={14} className="text-zinc-500" />
          )}
          <span className={clsx(
            "text-[10px] font-bold uppercase tracking-widest",
            u.role === 'admin' ? "text-accent" : "text-zinc-400"
          )}>
            {u.role === 'admin' ? 'Administrador' : 'Cliente'}
          </span>
        </div>
      ),
    },
    {
      header: 'Ações',
      accessor: (u: Profile) => (
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
                    <Eye size={14} /> Ver Detalhes
                  </button>
                  <button 
                    onClick={() => setActiveMenu(null)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <Edit size={14} /> Editar Perfil
                  </button>
                  <div className="h-px bg-zinc-800" />
                  <button 
                    onClick={() => {
                      toggleUserStatus(u.id, u.role);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  >
                    <UserX size={14} /> Alterar Permissão
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle size={48} className="text-red-500" />
        <div className="text-center">
          <h3 className="text-xl font-bold">Erro ao carregar usuários</h3>
          <p className="text-zinc-500">{error}</p>
        </div>
        <button onClick={() => fetchUsers()} className="btn-primary px-6 py-2">Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Usuários</h1>
          <p className="text-zinc-500 text-sm">Gerencie seus clientes e base de usuários reais do Supabase.</p>
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-zinc-300 cursor-pointer"
            >
              <option value="all">Todos Níveis</option>
              <option value="admin">Administradores</option>
              <option value="customer">Clientes</option>
            </select>
          </div>

          <div className="h-8 w-px bg-zinc-800 hidden lg:block" />

          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Total: <span className="text-white">{filteredUsers.length} usuários</span>
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
