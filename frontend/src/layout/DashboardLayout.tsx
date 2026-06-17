import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast'; // ✅ Impor toast untuk notifikasi logout
import {
  LayoutDashboard,
  Users,
  Sliders,
  ClipboardList,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
  Truck,
  ChevronRight,
  Bell,
  Settings,
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  group?: string;
}

// ✅ Perbaikan Path: Menggunakan huruf kecil agar sinkron dengan App.tsx
const navItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard', group: 'Menu Utama' },
  { to: '/dashboard/supplier', icon: <Truck size={18} />, label: 'Data Supplier', group: 'Menu Utama' },
  { to: '/dashboard/user', icon: <Users size={18} />, label: 'Manajemen User', group: 'Menu Utama' },
  { to: '/dashboard/kriteria', icon: <Sliders size={18} />, label: 'Kriteria Penilaian', group: 'Perhitungan' },
  { to: '/dashboard/penilaian', icon: <ClipboardList size={18} />, label: 'Input Penilaian', group: 'Perhitungan' },
  { to: '/dashboard/hasil', icon: <BarChart3 size={18} />, label: 'Hasil SAW', group: 'Perhitungan' },
  { to: '/dashboard/laporan', icon: <FileText size={18} />, label: 'Laporan', group: 'Laporan' },
  { to: '/dashboard/settings', icon: <Settings size={18} />, label: 'Pengaturan', group: 'Laporan' },
];

const groups = ['Menu Utama', 'Perhitungan', 'Laporan'];

interface SidebarContentProps {
  user: { name?: string; username?: string } | null;
  onClose: () => void;
  onLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ user, onClose, onLogout }) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="px-5 py-5 border-b border-slate-800">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
          <Truck size={18} />
        </div>
        <div className="leading-none">
          <span className="text-white font-extrabold text-sm tracking-wide block">SPK-SUPPLIER</span>
          <span className="text-slate-500 text-[9px] font-semibold tracking-widest uppercase">Decision Support</span>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
      {groups.map((group) => (
        <div key={group}>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-1.5">{group}</p>
          <div className="space-y-0.5">
            {navItems
              .filter((item) => item.group === group)
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'} // Menghindari tabrakan aktif indikator rute
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight size={14} className="text-indigo-200" />}
                    </>
                  )}
                </NavLink>
              ))}
          </div>
        </div>
      ))}
    </nav>

    {/* User Info & Logout */}
    <div className="px-3 py-4 border-t border-slate-800">
      <div className="flex items-center space-x-3 px-3 py-2.5 mb-1 bg-slate-800/50 rounded-lg">
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate">{user?.name || 'Admin'}</p>
          <p className="text-slate-500 text-[10px] truncate">{user?.username || '-'}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
      >
        <LogOut size={16} />
        <span>Keluar Sistem</span>
      </button>
    </div>
  </div>
);

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Bersihkan token/session auth

    // ✅ Tampilkan notifikasi keluar yang informatif
    toast.success('Berhasil keluar dari sistem!', {
      duration: 3000,
      icon: '🚀',
    });

    navigate('/login'); // Pindah ke halaman login
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* ─── SIDEBAR DESKTOP ─── */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 fixed inset-y-0 left-0 z-30">
        <SidebarContent
          user={user}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* ─── SIDEBAR MOBILE OVERLAY ─── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 flex flex-col w-64 bg-slate-900 h-full">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent
              user={user}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* ─── MAIN AREA ─── */}
      <div className="flex-1 flex flex-col lg:ml-60 min-h-screen">
        {/* ─── TOPBAR ─── */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:flex items-center space-x-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-800">SPK-Supplier</span>
            <ChevronRight size={14} />
            <span>Dashboard</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
            >
              <nav>
                <Bell size={18} />
              </nav>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{user?.username || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ─── PAGE CONTENT ─── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* ─── FOOTER ─── */}
        <footer className="px-8 py-4 text-xs text-slate-400 border-t border-slate-200 bg-white text-center">
          &copy; 2026 Universitas Harkat Negeri &mdash; SPK Pemilihan Supplier Terbaik
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;