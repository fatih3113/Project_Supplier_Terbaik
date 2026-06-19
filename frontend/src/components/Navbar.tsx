import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Truck } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        navScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/25">
            <Truck size={18} />
          </div>
          <div className="leading-none">
            <span className="text-base font-black text-slate-900 tracking-wide block">
              SPK-SUPPLIER
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
              Decision Support System
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <a href="#beranda"   className="hover:text-indigo-600 transition-colors">Beranda</a>
          <a href="#fitur"     className="hover:text-indigo-600 transition-colors">Fitur</a>
          <a href="#cara-kerja" className="hover:text-indigo-600 transition-colors">Cara Kerja</a>
          <a href="#tentang"   className="hover:text-indigo-600 transition-colors">Tentang</a>
        </nav>

        {/* CTA */}
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
        >
          <LogIn size={14} />
          <span>Masuk Sistem</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;