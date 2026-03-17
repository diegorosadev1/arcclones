import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Account } from "./pages/Account";
import { Wishlist } from "./pages/Wishlist";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";

// Admin Imports
import { AdminLogin } from "./admin/features/auth/pages/AdminLoginPage";
import { Dashboard } from "./admin/features/dashboard/pages/DashboardPage";
import { ProductList } from "./admin/features/products/pages/ProductListPage";
import { OrderList } from "./admin/features/orders/pages/OrderListPage";
import { OrderDetails } from "./admin/features/orders/pages/OrderDetailsPage";
import { ProductCreatePage } from "./admin/features/products/pages/new/ProductCreatePage";
import { ProductViewPage } from "./admin/features/products/pages/[id]/ProductViewPage";
import { ProductEditPage } from "./admin/features/products/pages/[id]/edit/ProductEditPage";
import { AdminLayout } from "./admin/components/layout/AdminLayout";
import { UserList } from "./admin/features/users/pages/UserListPage";
import { Toaster } from "./components/Toaster";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />

            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="checkout/success"
              element={
                <ProtectedRoute>
                  <CheckoutSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="produtos" element={<ProductList />} />
            <Route path="produtos/novo" element={<ProductCreatePage />} />
            <Route path="produtos/:id" element={<ProductViewPage />} />
            <Route path="produtos/:id/editar" element={<ProductEditPage />} />

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
      </Router>
    </AuthProvider>
  );
}