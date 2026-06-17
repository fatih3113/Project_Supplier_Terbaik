import React from 'react';
import { Outlet } from 'react-router-dom';
import { BarChart3, Truck, ShieldCheck, Star, TrendingUp } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex font-sans">
      {/* ─── PANEL KIRI: Ilustrasi & Branding ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex-col">
        {/* Dot grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.06)_1px,_transparent_0)] bg-[size:28px_28px]" />

        {/* Glow orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />

        {/* Logo atas */}
        <div className="relative z-10 p-8 flex items-center space-x-3">
          <div className="bg-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <Truck size={22} />
          </div>
          <div className="leading-none">
            <span className="text-white font-extrabold text-lg tracking-wide block">SPK-SUPPLIER</span>
            <span className="text-indigo-300 text-[10px] font-semibold tracking-widest uppercase">Decision Support System</span>
          </div>
        </div>

        {/* Konten tengah */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-12 text-center">
          {/* Visual card besar */}
          <div className="w-full max-w-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
            <div className="w-20 h-20 mx-auto bg-indigo-500/20 border border-indigo-400/30 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 size={40} className="text-indigo-400" />
            </div>

            {/* Mini dashboard preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Star size={14} className="text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-xs font-semibold">PT Maju Jaya</p>
                    <p className="text-indigo-300 text-[10px]">Rank #1 Supplier</p>
                  </div>
                </div>
                <span className="text-emerald-400 text-sm font-bold">0.921</span>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp size={14} className="text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-xs font-semibold">CV Berkah Abadi</p>
                    <p className="text-indigo-300 text-[10px]">Rank #2 Supplier</p>
                  </div>
                </div>
                <span className="text-indigo-400 text-sm font-bold">0.874</span>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <ShieldCheck size={14} className="text-amber-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-xs font-semibold">UD Sentosa Group</p>
                    <p className="text-indigo-300 text-[10px]">Rank #3 Supplier</p>
                  </div>
                </div>
                <span className="text-amber-400 text-sm font-bold">0.756</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-white leading-tight mb-3">
            Evaluasi Supplier<br />
            <span className="text-indigo-400">Lebih Cerdas</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Platform SPK berbasis metode SAW untuk penilaian mitra logistik secara objektif dan terukur.
          </p>
        </div>

        {/* Badge bawah */}
        <div className="relative z-10 p-8 flex justify-center">
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-slate-400 text-xs">Universitas Harkat Negeri &mdash; SUPPLIER TERBAIK 2026</span>
          </div>
        </div>
      </div>

      {/* ─── PANEL KANAN: Form Auth ─── */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-12 sm:px-12 lg:px-16">
        {/* Logo mobile only */}
        <div className="lg:hidden flex items-center space-x-2 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Truck size={20} />
          </div>
          <span className="text-xl font-extrabold text-slate-800">SPK-SUPPLIER</span>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;