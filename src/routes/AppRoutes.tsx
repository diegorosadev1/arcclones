import { Routes } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { AdminRoutes } from "./AdminRoutes";

export function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes()}
      {AdminRoutes()}
    </Routes>
  );
}