import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}