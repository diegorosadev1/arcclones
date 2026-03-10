/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category } from '../types';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface StatusHistoryEntry {
  status: OrderStatus;
  label: string;
  timestamp: string;
  description?: string;
}

export interface PaymentEvent {
  event: string;
  status: PaymentStatus;
  timestamp: string;
  description?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  lastOrderDate?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  trackingCode?: string;
  carrier?: string;
  deliveryForecast?: string;
  statusHistory: StatusHistoryEntry[];
  paymentEvents: PaymentEvent[];
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface DashboardMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  ticketAverage: number;
  totalProducts: number;
  lowStockCount: number;
  newCustomersCount: number;
  totalCustomers: number;
  pendingOrdersCount: number;
  paidOrdersCount: number;
  cancelledOrdersCount: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}
