import { supabase } from "../lib/supabase";
import { Address } from "../types";

type CreateAddressInput = Omit<
  Address,
  "id" | "created_at" | "updated_at"
>;

type UpdateAddressInput = Partial<
  Omit<Address, "id" | "created_at" | "updated_at">
>;

export const addressService = {
  async getAddresses(userId: string): Promise<Address[]> {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Address[]) || [];
  },

  async createAddress(address: CreateAddressInput): Promise<Address> {
    const newAddress: CreateAddressInput = {
      ...address,
      complement:
        address.complement && address.complement.trim() !== ""
          ? address.complement.trim()
          : null,
      country:
        address.country && address.country.trim() !== ""
          ? address.country.trim()
          : "Brasil",
    };

    const addresses = await this.getAddresses(newAddress.user_id);

    if (addresses.length === 0) {
      newAddress.is_default = true;
    }

    if (newAddress.is_default) {
      await this.unsetPrimary(newAddress.user_id);
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert([newAddress])
      .select()
      .single();

    if (error) throw error;
    return data as Address;
  },

  async updateAddress(id: string, updates: UpdateAddressInput): Promise<Address> {
    const finalUpdates: UpdateAddressInput = {
      ...updates,
    };

    if (typeof finalUpdates.complement === "string") {
      finalUpdates.complement =
        finalUpdates.complement.trim() !== ""
          ? finalUpdates.complement.trim()
          : null;
    }

    if (typeof finalUpdates.country === "string") {
      finalUpdates.country =
        finalUpdates.country.trim() !== ""
          ? finalUpdates.country.trim()
          : "Brasil";
    }

    if (finalUpdates.is_default && finalUpdates.user_id) {
      await this.unsetPrimary(finalUpdates.user_id);
    }

    const { data, error } = await supabase
      .from("addresses")
      .update(finalUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Address;
  },

  async deleteAddress(id: string): Promise<void> {
    const { error } = await supabase.from("addresses").delete().eq("id", id);

    if (error) throw error;
  },

  async setPrimary(id: string, userId: string): Promise<void> {
    await this.unsetPrimary(userId);

    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);

    if (error) throw error;
  },

  async unsetPrimary(userId: string): Promise<void> {
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId);

    if (error) throw error;
  },
};