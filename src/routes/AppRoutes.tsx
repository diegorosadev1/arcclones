import { Routes, Route } from "react-router-dom";

import { MainLayout } from "../layouts/MainLayout";

import { Home } from "../pages/Home";
import { Catalog } from "../pages/Catalog";
import { ProductDetails } from "../pages/ProductDetails";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Account } from "../pages/Account";
import { Wishlist } from "../pages/Wishlist";

import { AdminLayout } from "../admin/components/layout/AdminLayout";
import { AdminLogin } from "../admin/pages/login/AdminLogin";
import { Dashboard } from "../admin/pages/dashboard/Dashboard";
import { ProductList } from "../admin/pages/products/ProductList";
import { ProductForm } from "../admin/pages/products/ProductForm";
import { OrderDetails } from "../admin/pages/orders/OrderDetails";
import { UserList } from "../admin/pages/users/UserList";
import { OrderList } from "../admin/pages/login/OrderList";

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="account" element={<Account />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      {/* Rotas admin */}
      <Route path="/admin/login" element={<AdminLogin />} />

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
        <Route
          path="configuracoes"
          element={
            <div className="p-8 text-center text-zinc-500">
              Configurações em breve...
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
