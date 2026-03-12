/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { useAdminDashboardStore } from '../stores/useAdminDashboardStore';
import { useAdminOrdersStore } from '../stores/useAdminOrdersStore';
import { useProductStore } from '../../store/useProductStore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export function Dashboard() {
  const { metrics, salesData, statusDistribution, fetchDashboardData } = useAdminDashboardStore();
  const { orders, fetchOrders } = useAdminOrdersStore();
  const { products, fetchProducts } = useProductStore();
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchDashboardData(period);
    fetchOrders();
    fetchProducts();
  }, [period, fetchDashboardData, fetchOrders, fetchProducts]);

  const lowStockProducts = (Array.isArray(products) ? products : []).filter(p => (p?.stock || 0) < 5);
  const recentOrders = (Array.isArray(orders) ? [...orders] : [])
    .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header & Period Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Visão Geral</h1>
          <p className="text-zinc-500 text-sm">Bem-vindo ao painel administrativo da LUXE.</p>
        </div>

        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-1">
          {[
            { id: 'today', label: 'Hoje' },
            { id: '7d', label: '7 Dias' },
            { id: '30d', label: '30 Dias' },
            { id: '90d', label: '90 Dias' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as any)}
              className={clsx(
                "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                period === p.id ? "bg-accent text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Faturamento Total" 
          value={`R$ ${metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          trend={{ value: 12.5, isUp: true }}
          color="accent"
        />
        <MetricCard 
          label="Total de Pedidos" 
          value={metrics.totalOrders} 
          icon={ShoppingBag} 
          trend={{ value: 8.2, isUp: true }}
          color="blue"
        />
        <MetricCard 
          label="Ticket Médio" 
          value={`R$ ${metrics.ticketAverage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={TrendingUp} 
          trend={{ value: 3.1, isUp: false }}
          color="emerald"
        />
        <MetricCard 
          label="Novos Clientes" 
          value={metrics.newCustomersCount} 
          icon={Users} 
          trend={{ value: 15.4, isUp: true }}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl">Desempenho de Vendas</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full" /> Receita
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" /> Pedidos
              </div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E11D48" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass-card p-8 space-y-8">
          <h3 className="font-display font-bold text-xl">Status dos Pedidos</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#E11D48', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-display font-bold">{metrics.totalOrders}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {statusDistribution.map((item, i) => (
              <div key={item.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#E11D48', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 5] }} />
                  <span className="text-zinc-400">{item.status}</span>
                </div>
                <span className="font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="glass-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl">Pedidos Recentes</h3>
            <Link to="/admin/pedidos" className="text-accent text-xs font-bold hover:underline flex items-center gap-1">
              Ver Todos <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-accent/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-accent">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{order.customerName}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">R$ {order.total.toLocaleString('pt-BR')}</p>
                  <span className={clsx(
                    "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                    order.status === 'delivered' ? "bg-emerald-500/10 text-emerald-500" :
                    order.status === 'processing' ? "bg-blue-500/10 text-blue-500" :
                    order.status === 'shipped' ? "bg-indigo-500/10 text-indigo-500" :
                    order.status === 'cancelled' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl">Alertas de Estoque</h3>
            <span className="bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {lowStockProducts.length} Críticos
            </span>
          </div>
          
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-800">
                      <img 
                        src={product?.images?.[0] || 'https://picsum.photos/seed/luxury/100/100'} 
                        alt={product?.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{product.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={clsx(
                      "text-sm font-bold",
                      product.stock === 0 ? "text-red-500" : "text-amber-500"
                    )}>
                      {product.stock} em estoque
                    </p>
                    <Link to={`/admin/produtos/${product.id}/editar`} className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">
                      Repor Estoque
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 space-y-4">
                <CheckCircle size={48} className="mx-auto text-emerald-500/20" />
                <p className="text-zinc-500 text-sm">Todos os produtos estão com estoque em dia.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
