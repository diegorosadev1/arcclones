/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser } from '../types';
import { mockAdminUser } from '../mocks';

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Mock login logic
        if (email === 'admin@luxe.com' && password === 'admin123') {
          set({ admin: mockAdminUser, isAuthenticated: true });
        } else {
          throw new Error('Credenciais inválidas');
        }
      },
      logout: () => set({ admin: null, isAuthenticated: false }),
    }),
    {
      name: 'luxe-admin-auth',
    }
  )
);
