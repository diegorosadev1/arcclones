/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Customer } from '../types';
import { mockCustomers } from '../mocks';

interface AdminUsersStoreState {
  users: Customer[];
  isLoading: boolean;
  fetchUsers: () => void;
  updateUser: (id: string, user: Partial<Customer>) => void;
  toggleUserStatus: (id: string) => void;
}

export const useAdminUsersStore = create<AdminUsersStoreState>((set) => ({
  users: mockCustomers,
  isLoading: false,
  fetchUsers: () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      set({ isLoading: false });
    }, 500);
  },
  updateUser: (id, updatedFields) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updatedFields } : u)),
    }));
  },
  toggleUserStatus: (id) => {
    set((state) => ({
      users: state.users.map((u) => 
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      ),
    }));
  },
}));
