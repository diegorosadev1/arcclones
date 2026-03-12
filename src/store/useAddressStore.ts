import { create } from 'zustand';
import { Address } from '../types';
import { addressService } from '../services/addressService';

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  fetchAddresses: (userId: string) => Promise<void>;
  addAddress: (address: Omit<Address, 'id' | 'created_at'>) => Promise<void>;
  updateAddress: (id: string, updates: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setPrimaryAddress: (id: string, userId: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const addresses = await addressService.getAddresses(userId);
      set({ addresses, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addAddress: async (address) => {
    set({ isLoading: true, error: null });
    try {
      await addressService.createAddress(address);
      await get().fetchAddresses(address.user_id);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateAddress: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await addressService.updateAddress(id, updates);
      if (updates.user_id) {
        await get().fetchAddresses(updates.user_id);
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteAddress: async (id) => {
    const address = get().addresses.find(a => a.id === id);
    if (!address) return;
    
    set({ isLoading: true, error: null });
    try {
      await addressService.deleteAddress(id);
      await get().fetchAddresses(address.user_id);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setPrimaryAddress: async (id, userId) => {
    set({ isLoading: true, error: null });
    try {
      await addressService.setPrimary(id, userId);
      await get().fetchAddresses(userId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
