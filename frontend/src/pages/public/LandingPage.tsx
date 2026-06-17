import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogIn,
  ShieldCheck,
  BarChart3,
  Truck,
  Star,
  TrendingUp,
  Award,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShieldCheck size={22} />,
      color: 'emerald',
      title: 'Penilaian Objektif',
      desc: 'Menghilangkan unsur subjektivitas dalam memilih mitra logistik perusahaan dengan pendekatan multi-kriteria.',
    },
    {
      icon: <BarChart3 size={22} />,
      color: 'indigo',
      title: 'Metode SAW',
      desc: 'Algoritma Simple Additive Weighting yang telah teruji untuk menghasilkan peringkat supplier secara akurat.',
    },
    {
      icon: <Truck size={22} />,
      color: 'amber',
      title: 'Optimasi Rantai Pasok',
      desc: 'Bantu perusahaan mendapatkan komoditas terbaik dari mitra supplier yang paling layak secara terukur.',
    },
  ];

  const stats = [
    { value: '50+', label: 'Supplier Terdaftar' },
    { value: '12', label: 'Kriteria Penilaian' },
    { value: '99%', label: 'Akurasi Perhitungan' },
    { value: '2025', label: 'Tahun Dikembangkan' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ─── NAVBAR ─── */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/25">
              <Truck size={20} />
            </div>
            <div className="leading-none">
              <span className="text-lg font-black text-slate-900 tracking-wide block">SPK-SUPPLIER</span>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Decision Support System</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#beranda" className="text-indigo-600">Beranda</a>
            <a href="#fitur" className="hover:text-indigo-600 transition-colors">Fitur</a>
            <a href="#tentang" className="hover:text-indigo-600 transition-colors">Tentang</a>
          </nav>

          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            <LogIn size={15} />
            <span>Masuk Sistem</span>
          </button>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <main id="beranda" className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.08)_0%,_transparent_60%)]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-violet-100 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Kiri: Teks */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span>Intelligent Supply Chain</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 tracking-tight leading-[1.1]">
              Analisis Pemilihan<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Supplier Terbaik
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Sistem Pendukung Keputusan komprehensif untuk penilaian, standardisasi, dan pemeringkatan mitra supplier secara objektif berdasarkan multi-kriteria strategis.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
              >
                <span>Mulai Penilaian</span>
                <ArrowRight size={16} />
              </button>
              <a
                href="#fitur"
                className="inline-flex items-center space-x-2 border border-slate-300 hover:border-indigo-400 hover:text-indigo-600 text-slate-700 font-bold text-sm px-7 py-3.5 rounded-xl bg-white transition-all"
              >
                <span>Pelajari Metode</span>
              </a>
            </div>

            {/* Stats mini */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <p className="text-2xl font-black text-indigo-600">{s.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kanan: Visual Card */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-indigo-400/20 rounded-3xl blur-2xl scale-110" />

              <div className="relative w-80 sm:w-96 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 shadow-2xl border border-white/10 overflow-hidden">
                {/* Dot pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.04)_1px,_transparent_0)] bg-[size:20px_20px]" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Hasil Evaluasi</p>
                    <p className="text-white font-bold text-sm">Periode Juni 2026</p>
                  </div>
                  <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                    Live
                  </div>
                </div>

                {/* Ranking cards */}
                <div className="relative z-10 space-y-3">
                  {[
                    { rank: 1, name: 'PT Maju Jaya Logistik', score: 0.921, badge: 'bg-amber-500', badgeIcon: <Award size={10} />, progressClass: 'w-[92%]' },
                    { rank: 2, name: 'CV Berkah Abadi', score: 0.874, badge: 'bg-slate-500', badgeIcon: <Star size={10} />, progressClass: 'w-[87%]' },
                    { rank: 3, name: 'UD Sentosa Group', score: 0.756, badge: 'bg-orange-700', badgeIcon: <TrendingUp size={10} />, progressClass: 'w-[76%]' },
                  ].map((item) => (
                    <div key={item.rank} className="flex items-center justify-between bg-white/5 border border-white/8 rounded-2xl p-3.5 hover:bg-white/8 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`${item.badge} w-6 h-6 rounded-full flex items-center justify-center text-white`}>
                          {item.badgeIcon}
                        </div>
                        <div>
                          <p className="text-white text-xs font-semibold">{item.name}</p>
                          <p className="text-slate-500 text-[10px]">Rank #{item.rank}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-indigo-300 text-sm font-bold">{item.score.toFixed(3)}</p>
                        {/* Progress bar */}
                        <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full bg-indigo-400 rounded-full ${item.progressClass}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer card */}
                <div className="relative z-10 mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <p className="text-slate-500 text-[10px]">Powered by SAW Algorithm</p>
                  <div className="flex items-center space-x-1 text-indigo-400 text-[10px] font-semibold cursor-pointer hover:text-indigo-300 transition-colors">
                    <span>Detail lengkap</span>
                    <ChevronRight size={10} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── FITUR ─── */}
      <section id="fitur" className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-2">Keunggulan Sistem</p>
            <h2 className="text-3xl font-black text-slate-900">Mengapa SPK-Supplier?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 rounded-2xl p-6 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  f.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  f.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {f.icon}
                </div>
                <h4 className="font-bold text-slate-800 text-base mb-2">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section id="tentang" className="bg-gradient-to-br from-indigo-600 to-violet-700 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Siap Memulai Evaluasi Supplier?
          </h2>
          <p className="text-indigo-200 text-base mb-8 max-w-xl mx-auto">
            Masuk ke sistem sekarang dan mulai proses penilaian supplier secara objektif dan efisien.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center space-x-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm px-8 py-4 rounded-xl shadow-xl transition-all"
          >
            <LogIn size={16} />
            <span>Masuk ke Dashboard</span>
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Truck size={14} />
            </div>
            <span className="text-slate-400 text-xs font-semibold">SPK-SUPPLIER</span>
          </div>
          <p className="text-slate-500 text-xs text-center">
            &copy; 2026 Universitas Harkat Negeri &mdash; SPK Pemilihan Supplier Terbaik. All rights reserved.
          </p>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-slate-500 text-xs">SUPPLIER TERBAIK 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;