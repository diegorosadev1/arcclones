/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Watches' | 'Shoulder Bags' | 'Glasses' | 'Jewelry';

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

export interface User {
  id: string;
  name: string;
  email: string;
  addresses: Address[];
  orders: Order[];
  wishlist: string[]; // Product IDs
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  total: number;
  addressId: string;
  paymentMethod: string;
}

export interface CartItem extends Product {
  quantity: number;
}
