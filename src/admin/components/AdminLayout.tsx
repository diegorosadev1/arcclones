/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export function AdminLayout() {
  const { isAuthenticated } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, path };
  });

  return (
    <div className="min-h-screen bg-luxury-black text-white flex">
      <AdminSidebar />
      <div className="flex-grow ml-64 flex flex-col min-h-screen">
        <AdminHeader />
        
        <main className="flex-grow p-8 space-y-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-8">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <span className={index === breadcrumbs.length - 1 ? "text-accent" : "hover:text-zinc-300 transition-colors"}>
                  {crumb.label}
                </span>
                {index < breadcrumbs.length - 1 && <ChevronRight size={10} />}
              </React.Fragment>
            ))}
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="p-8 border-t border-zinc-800 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          LUXE Admin Panel &copy; 2026 - Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
}
