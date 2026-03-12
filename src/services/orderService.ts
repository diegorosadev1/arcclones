import { supabase } from '../lib/supabase';
import { Order } from '../types';

export const orderService = {
  async getOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('userId', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async getOrderById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Order;
  },

  async createOrder(order: Omit<Order, 'id'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },

  async updateOrder(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  }
};
