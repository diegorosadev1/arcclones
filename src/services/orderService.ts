import { supabase } from "../lib/supabase";
import { Order } from "../types";

export const orderService = {
  async getOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("userId", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  async getOrderById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Order;
  },

  async createOrder(order: Omit<Order, "id">) {
    const { data, error } = await supabase
      .from("orders")
      .insert([order])
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },

  async updateOrder(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },
};

export type CheckoutPaymentMethod = 'card' | 'pix' | 'boleto';

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
  payment_method: CheckoutPaymentMethod;
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

export async function createCheckoutSession(
  payload: CreateCheckoutSessionPayload
): Promise<CreateCheckoutSessionResponse> {
  const { data, error } = await supabase.functions.invoke(
    'create-checkout-session',
    {
      body: payload,
    }
  );

  if (error) {
    throw new Error(error.message || 'Erro ao criar sessão de checkout.');
  }

  if (!data) {
    throw new Error('Resposta vazia da função de checkout.');
  }

  if (!data.checkout_url) {
    throw new Error('checkout_url não retornado pela função.');
  }

  return data as CreateCheckoutSessionResponse;
}
