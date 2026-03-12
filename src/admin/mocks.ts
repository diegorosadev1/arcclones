/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdminUser, Customer, Order, DashboardMetrics, SalesData, StatusDistribution } from './types';
import { products } from '../data/products';

export const mockAdminUser: AdminUser = {
  id: 'admin-1',
  name: 'Admin LUXE',
  email: 'admin@luxe.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  role: 'admin',
};

export const mockCustomers: Customer[] = [
  {
    id: 'c-1',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@email.com',
    phone: '(11) 98765-4321',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2025-10-15T10:00:00Z',
    totalOrders: 5,
    totalSpent: 12500.50,
    status: 'active',
    lastOrderDate: '2026-03-01T14:30:00Z',
  },
  {
    id: 'c-2',
    name: 'Bruno Silva',
    email: 'bruno.silva@email.com',
    phone: '(21) 99887-7665',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2025-11-20T15:30:00Z',
    totalOrders: 2,
    totalSpent: 4200.00,
    status: 'active',
    lastOrderDate: '2026-02-15T09:15:00Z',
  },
  {
    id: 'c-3',
    name: 'Carla Mendes',
    email: 'carla.mendes@email.com',
    phone: '(31) 97766-5544',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2026-01-05T08:45:00Z',
    totalOrders: 1,
    totalSpent: 1500.00,
    status: 'inactive',
    lastOrderDate: '2026-01-05T08:45:00Z',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'o-1',
    orderNumber: 'LX-1001',
    customerId: 'c-1',
    customerName: 'Ana Oliveira',
    customerEmail: 'ana.oliveira@email.com',
    items: [
      {
        productId: '1',
        name: 'Onyx Stealth',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        price: 1250,
        quantity: 1,
      },
    ],
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    subtotal: 1250,
    shipping: 0,
    discount: 0,
    total: 1250,
    createdAt: '2026-03-01T14:30:00Z',
    updatedAt: '2026-03-05T10:00:00Z',
    paidAt: '2026-03-01T14:35:00Z',
    shippedAt: '2026-03-02T11:00:00Z',
    deliveredAt: '2026-03-05T10:00:00Z',
    trackingCode: 'LX123456789BR',
    carrier: 'Loggi Premium',
    deliveryForecast: '2026-03-06',
    statusHistory: [
      { status: 'pending', label: 'Pedido Criado', timestamp: '2026-03-01T14:30:00Z', description: 'Aguardando confirmação de pagamento.' },
      { status: 'processing', label: 'Pagamento Confirmado', timestamp: '2026-03-01T14:35:00Z', description: 'O pagamento foi aprovado e o pedido está em separação.' },
      { status: 'shipped', label: 'Pedido Enviado', timestamp: '2026-03-02T11:00:00Z', description: 'O pedido foi entregue à transportadora.' },
      { status: 'delivered', label: 'Pedido Entregue', timestamp: '2026-03-05T10:00:00Z', description: 'O pedido foi entregue no endereço de destino.' },
    ],
    paymentEvents: [
      { event: 'Autorização', status: 'pending', timestamp: '2026-03-01T14:30:05Z', description: 'Autorização solicitada à operadora.' },
      { event: 'Captura', status: 'paid', timestamp: '2026-03-01T14:35:00Z', description: 'Pagamento capturado com sucesso.' },
    ],
    shippingAddress: {
      street: 'Av. Paulista',
      number: '1000',
      city: 'São Paulo',
      state: 'SP',
      zip: '01310-100',
    },
  },
  {
    id: 'o-2',
    orderNumber: 'LX-1002',
    customerId: 'c-2',
    customerName: 'Bruno Silva',
    customerEmail: 'bruno.silva@email.com',
    items: [
      {
        productId: '2',
        name: 'Celestial Gold',
        image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800',
        price: 2100,
        quantity: 1,
      },
    ],
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'pix',
    subtotal: 2100,
    shipping: 0,
    discount: 0,
    total: 2100,
    createdAt: '2026-03-08T16:45:00Z',
    updatedAt: '2026-03-08T16:50:00Z',
    paidAt: '2026-03-08T16:50:00Z',
    statusHistory: [
      { status: 'pending', label: 'Pedido Criado', timestamp: '2026-03-08T16:45:00Z', description: 'Aguardando pagamento via PIX.' },
      { status: 'processing', label: 'Pagamento Confirmado', timestamp: '2026-03-08T16:50:00Z', description: 'O pagamento foi aprovado e o pedido está em separação.' },
    ],
    paymentEvents: [
      { event: 'Geração de QR Code', status: 'pending', timestamp: '2026-03-08T16:45:10Z', description: 'QR Code gerado para o cliente.' },
      { event: 'Confirmação PIX', status: 'paid', timestamp: '2026-03-08T16:50:00Z', description: 'Pagamento recebido via PIX.' },
    ],
    shippingAddress: {
      street: 'Rua das Flores',
      number: '50',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zip: '22000-000',
    },
  },
  {
    id: 'o-3',
    orderNumber: 'LX-1003',
    customerId: 'c-1',
    customerName: 'Ana Oliveira',
    customerEmail: 'ana.oliveira@email.com',
    items: [
      {
        productId: '5',
        name: 'Midnight Tote',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
        price: 850,
        quantity: 1,
      },
    ],
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'boleto',
    subtotal: 850,
    shipping: 45,
    discount: 0,
    total: 895,
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-10T09:00:00Z',
    statusHistory: [
      { status: 'pending', label: 'Pedido Criado', timestamp: '2026-03-10T09:00:00Z', description: 'Aguardando compensação do boleto.' },
    ],
    paymentEvents: [
      { event: 'Emissão de Boleto', status: 'pending', timestamp: '2026-03-10T09:00:05Z', description: 'Boleto emitido com vencimento em 3 dias.' },
    ],
    shippingAddress: {
      street: 'Av. Paulista',
      number: '1000',
      city: 'São Paulo',
      state: 'SP',
      zip: '01310-100',
    },
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalRevenue: 158450.75,
  monthlyRevenue: 42300.50,
  totalOrders: 124,
  ticketAverage: 1277.82,
  totalProducts: products.length,
  lowStockCount: 3,
  newCustomersCount: 12,
  totalCustomers: 85,
  pendingOrdersCount: 8,
  paidOrdersCount: 15,
  cancelledOrdersCount: 2,
};

export const mockSalesData: SalesData[] = [
  { date: '2026-03-04', revenue: 4500, orders: 3 },
  { date: '2026-03-05', revenue: 5200, orders: 4 },
  { date: '2026-03-06', revenue: 3800, orders: 2 },
  { date: '2026-03-07', revenue: 6100, orders: 5 },
  { date: '2026-03-08', revenue: 7500, orders: 6 },
  { date: '2026-03-09', revenue: 4200, orders: 3 },
  { date: '2026-03-10', revenue: 5800, orders: 4 },
];

export const mockStatusDistribution: StatusDistribution[] = [
  { status: 'Entregue', count: 65 },
  { status: 'Processando', count: 25 },
  { status: 'Pendente', count: 18 },
  { status: 'Enviado', count: 12 },
  { status: 'Cancelado', count: 4 },
];
