import { Route } from "react-router-dom";
import { AdminLayout } from "../admin/components/layout/AdminLayout";
import { AdminLogin } from "../admin/pages/login/AdminLogin";
import { Dashboard } from "../admin/pages/dashboard/Dashboard";
import { ProductList } from "../admin/pages/products/ProductList";
import { ProductForm } from "../admin/pages/products/ProductForm";
import { OrderDetails } from "../admin/pages/orders/OrderDetails";
import { UserList } from "../admin/pages/users/UserList";
import { AdminRoute } from "../auth/AdminRoute";
import { OrderList } from "../admin/pages/login/OrderList";

export function AdminRoutes() {
  return (
    <>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="produtos" element={<ProductList />} />
          <Route path="produtos/novo" element={<ProductForm />} />
          <Route path="produtos/:id" element={<ProductForm />} />
          <Route path="produtos/:id/editar" element={<ProductForm />} />

          <Route path="pedidos" element={<OrderList />} />
          <Route path="pedidos/:id" element={<OrderDetails />} />

          <Route path="usuarios" element={<UserList />} />
        </Route>
      </Route>
    </>
  );
}
