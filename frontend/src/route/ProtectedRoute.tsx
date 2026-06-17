import { useAuthStore } from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Menggunakan token untuk memastikan status login user
  const token = useAuthStore((state) => state.token);

  // Jika belum login (token kosong), redirect ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, izinkan mengakses halaman anak (Outlet)
  return <Outlet />;
}