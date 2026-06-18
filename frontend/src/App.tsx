import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'react-hot-toast'; // Impor Toaster untuk notifikasi global

// Impor Komponen Layout & Protected Route
import AuthLayout from './layout/AuthLayout';
import DashboardLayout from './layout/DashboardLayout';
import ProtectedRoute from './route/ProtectedRoute';

// Impor Halaman Publik
import LandingPage from './pages/public/LandingPage';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';

// Impor Halaman Dashboard
import Dashboard from './pages/Dashboard/Dashboard';
import Supplier from './pages/Supplier/SupplierIndex';
import Criteria from './pages/Criteria/CriteriaIndex';
import Assessment from './pages/Assessment/Assessment';
import Ranking from './pages/Rangking/Ranking';
import ManajemenUser from './pages/ManajemenUser/UsersIndex';
import Laporan from './pages/Laporan/Laporan';

const App: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      {/* Container untuk memunculkan bubble toast di pojok kanan atas */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* ─── ROUTE PUBLIK BERDIRI SENDIRI ─── */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Jika sudah login (punya token), jika akses halaman auth langsung dilempar ke /dashboard */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/forgot-password" element={!token ? <ForgotPassword /> : <Navigate to="/dashboard" replace />} />
        </Route>

        {/* ─── ROUTE DASHBOARD (KHUSUS YANG SUDAH LOGIN & PAKAI LAYOUT DASHBOARD) ─── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Menggunakan rute index untuk halaman utama dashboard */}
            <Route index element={<Dashboard />} />
            
            {/* Path rute anak */}
            <Route path="supplier" element={<Supplier />} />
            <Route path="kriteria" element={<Criteria />} />
            <Route path="penilaian" element={<Assessment />} />
            <Route path="hasil" element={<Ranking />} />
            
            {/* Placeholder untuk halaman pelengkap */}
            <Route path="user" element={<ManajemenUser />} />
            <Route path="laporan" element={<Laporan />} />
          </Route>
        </Route>

        {/* Fallback routing global jika mengetik alamat asal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;