import { Route } from "react-router-dom";
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
import { ProtectedRoute } from "../auth/ProtectedRoute";

export function PublicRoutes() {
  return (
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="catalog" element={<Catalog />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="cart" element={<Cart />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="wishlist" element={<Wishlist />} />

      <Route element={<ProtectedRoute />}>
        <Route path="checkout" element={<Checkout />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Route>
  );
}