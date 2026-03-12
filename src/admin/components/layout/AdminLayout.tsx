
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";

export function AdminLayout() {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, path };
  });

  return (
    <div className="min-h-screen bg-luxury-black text-white flex">
      <AdminSidebar />
      <div className="flex-grow ml-64 flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-grow p-8 space-y-8">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-8">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "text-accent"
                      : "hover:text-zinc-300 transition-colors"
                  }
                >
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
          ARC Admin Panel &copy; 2026 - Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
}