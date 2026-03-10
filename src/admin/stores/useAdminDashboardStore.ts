/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { DashboardMetrics, SalesData, StatusDistribution } from '../types';
import { mockDashboardMetrics, mockSalesData, mockStatusDistribution } from '../mocks';

interface AdminDashboardStoreState {
  metrics: DashboardMetrics;
  salesData: SalesData[];
  statusDistribution: StatusDistribution[];
  isLoading: boolean;
  fetchDashboardData: (period: 'today' | '7d' | '30d' | '90d') => void;
}

export const useAdminDashboardStore = create<AdminDashboardStoreState>((set) => ({
  metrics: mockDashboardMetrics,
  salesData: mockSalesData,
  statusDistribution: mockStatusDistribution,
  isLoading: false,
  fetchDashboardData: (period) => {
    set({ isLoading: true });
    // Simulate API call with period filtering
    setTimeout(() => {
      set({ isLoading: false });
    }, 500);
  },
}));
