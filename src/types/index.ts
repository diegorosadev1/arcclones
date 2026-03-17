/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Watches' | 'Shoulder Bags' | 'Glasses' | 'Jewelry';
export type UserRole = 'admin' | 'customer';
export type PaymentMethod = 'card' | 'pix' | 'boleto';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  promoPrice?: number;
  description: string;
  images: string[];
  rating: number;
  stock: number;
  sku: string;
  brand: string;
  material: string;
  color: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User extends Profile {
  addresses: Address[];
  orders: Order[];
  wishlist: string[];
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  zip_code: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderStatusHistory {
  status: Order['status'];
  date: string;
  description: string;
}

export interface TrackingHistory {
  date: string;
  location: string;
  description: string;
  status: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  addressId?: string;
  shippingAddress?: Address;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  trackingCode?: string;
  carrier?: string;
  estimatedDelivery?: string;
  statusHistory: OrderStatusHistory[];
  trackingHistory: TrackingHistory[];
  userId: string;
}

export interface CheckoutItemPayload {
  product_id: string;
  product_name: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface CreateCheckoutSessionPayload {
  user_id: string | null;
  customer_email: string;
  shipping_full_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip_code: string;
  shipping_country: string;
  payment_method: PaymentMethod;
  items: CheckoutItemPayload[];
  shipping_amount: number;
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutSessionResponse {
  checkout_url: string;
  order_id: string;
  session_id: string;
}