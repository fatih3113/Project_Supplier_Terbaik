import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/60">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
                <Truck size={18} />
              </div>
              <div className="leading-none">
                <span className="text-base font-black text-white tracking-wide block">SPK-SUPPLIER</span>
                <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Decision Support System</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Sistem pendukung keputusan berbasis metode SAW untuk pemilihan supplier terbaik secara objektif dan terukur.
            </p>
            <div className="flex items-center space-x-1 pt-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-slate-500 text-xs font-medium">Sistem aktif & berjalan</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigasi</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Beranda', href: '#beranda' },
                { label: 'Fitur Sistem', href: '#fitur' },
                { label: 'Tentang', href: '#tentang' },
                { label: 'Masuk Sistem', action: () => navigate('/login') },
              ].map((item) => (
                <li key={item.label}>
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className="text-slate-400 hover:text-indigo-400 text-sm transition-colors flex items-center space-x-1.5 group"
                    >
                      <span>{item.label}</span>
                      <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="text-slate-400 hover:text-indigo-400 text-sm transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2.5">
                <Mail size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">spk@Kelompok2.com</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <ExternalLink size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">https://www.kelompok2.com</span>
              </li>
            </ul>
            <div className="pt-2">
              <span className="inline-flex items-center space-x-1.5 bg-indigo-950 border border-indigo-800/60 text-indigo-400 text-xs px-3 py-1.5 rounded-full font-semibold">
                <span>⚡</span>
                <span>Powered by SAW Algorithm</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-600 text-xs">
            &copy; 2026 Kelompok2 — SPK Pemilihan Supplier Terbaik
          </p>
          <p className="text-slate-700 text-xs">
            Dibuat dengan ❤️ untuk efisiensi rantai pasok
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;