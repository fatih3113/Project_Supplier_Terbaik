import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import {
  LogIn, ShieldCheck, BarChart3, Truck, Star, TrendingUp,
  Award, ArrowRight, ChevronRight, RefreshCw, Zap,
  CheckCircle, BarChart2, GitMerge, ChevronDown,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface RankingItem {
  id: number;
  supplier_id?: number;
  supplier_name?: string;
  nama_supplier?: string;
  total_score?: number | string;
  nilai?: number | string;
  rank?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const safe = (val: unknown): number => {
  if (val === null || val === undefined || val === '') return 0;
  const n = parseFloat(String(val));
  return isNaN(n) ? 0 : n;
};
const getSupplierName = (item: RankingItem) =>
  item.nama_supplier || item.supplier_name || '-';
const getScore = (item: RankingItem) =>
  safe(item.total_score ?? item.nilai ?? 0);
const getRankBadge = (rank: number) => {
  if (rank === 1) return { badge: 'bg-amber-500',  icon: <Award      size={10} /> };
  if (rank === 2) return { badge: 'bg-slate-400',  icon: <Star      size={10} /> };
  return              { badge: 'bg-orange-700', icon: <TrendingUp size={10} /> };
};

// ── Hook: scroll-triggered reveal ─────────────────────────────────────────────
const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

// ── AnimatedCounter ────────────────────────────────────────────────────────────
const AnimatedCounter: React.FC<{ target: string; label: string }> = ({ target, label }) => {
  const { ref, inView } = useInView();
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const numericPart = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix      = target.replace(/[0-9.]/g, '');
    if (isNaN(numericPart)) { setDisplay(target); return; }
    let current = 0;
    const duration  = 1200;
    const step      = 16;
    const increment = numericPart / (duration / step);
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericPart) {
        setDisplay(`${numericPart}${suffix}`);
        clearInterval(timer);
      } else {
        setDisplay(`${Math.floor(current)}${suffix}`);
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center lg:text-left">
      <p className="text-2xl font-black text-indigo-400">{display}</p>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
    </div>
  );
};

// ── FeatureCard ────────────────────────────────────────────────────────────────
const delayClass: Record<number, string> = {
  0: 'animation-delay-0',
  1: 'animation-delay-120',
  2: 'animation-delay-240',
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  delayIndex: number;
}> = ({ icon, color, title, desc, delayIndex }) => {
  const { ref, inView } = useInView();

  const iconColor =
    color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
    color === 'indigo'  ? 'bg-indigo-100 text-indigo-600'   :
                          'bg-amber-100 text-amber-600';

  return (
    <div
      ref={ref}
      className={[
        'group relative bg-white border border-slate-100 rounded-2xl p-6 shadow-sm',
        'hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-500',
        delayClass[delayIndex] ?? '',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      ].join(' ')}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/60 group-hover:to-violet-50/40 transition-all duration-500" />
      <div className={`relative z-10 inline-flex p-3 rounded-xl mb-4 ${iconColor}`}>
        {icon}
      </div>
      <h4 className="relative z-10 font-bold text-slate-800 text-base mb-2">{title}</h4>
      <p className="relative z-10 text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

// ── HowItWorks ─────────────────────────────────────────────────────────────────
const steps = [
  { icon: <GitMerge size={20} />, title: 'Input Kriteria',  desc: 'Tentukan bobot dan jenis tiap kriteria penilaian (benefit/cost).' },
  { icon: <BarChart2 size={20} />, title: 'Nilai Supplier', desc: 'Masukkan nilai tiap supplier berdasarkan kriteria yang telah ditetapkan.' },
  { icon: <Zap       size={20} />, title: 'Hitung SAW',     desc: 'Sistem menormalisasi dan menghitung skor terbobot secara otomatis.' },
  { icon: <CheckCircle size={20} />, title: 'Lihat Ranking', desc: 'Dapatkan peringkat supplier terbaik berdasarkan skor akhir SAW.' },
];

const stepDelayClass: Record<number, string> = {
  0: 'animation-delay-0',
  1: 'animation-delay-100',
  2: 'animation-delay-200',
  3: 'animation-delay-300',
};

const HowItWorks: React.FC = () => {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-2">Alur Kerja</p>
          <h2 className="text-3xl font-black text-white">Bagaimana Sistem Bekerja?</h2>
          <p className="text-slate-400 text-sm mt-3 max-w-lg mx-auto">
            Empat langkah sederhana dari input data hingga hasil keputusan yang akurat.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={[
                'relative bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-600',
                stepDelayClass[i] ?? '',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              ].join(' ')}
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-slate-700 z-10" />
              )}
              <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-600/40 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">
                Langkah {i + 1}
              </div>
              <h4 className="text-white font-bold text-sm mb-2">{step.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const rankDelayClass: Record<number, string> = {
  0: 'animation-delay-0',
  1: 'animation-delay-100',
  2: 'animation-delay-200',
};

// ── Main LandingPage ───────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [rankings,    setRankings]    = useState<RankingItem[]>([]);
  const [loadingRank, setLoadingRank] = useState(true);
  const [period,      setPeriod]      = useState('');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const today     = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const formattedPeriod = `${year}-${month}`;

        const MONTHS_ID = [
          'Januari','Februari','Maret','April','Mei','Juni',
          'Juli','Agustus','September','Oktober','November','Desember',
        ];
        setPeriod(`${MONTHS_ID[today.getMonth()]} ${year}`);

        const res  = await api.get('/ranking', { params: { period: formattedPeriod } });
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const normalized = data.map((item: RankingItem, idx: number) => ({
          ...item,
          nama_supplier: item.nama_supplier || item.supplier_name || '-',
          total_score:   item.total_score ?? item.nilai ?? 0,
          rank:          item.rank ?? idx + 1,
        }));
        setRankings(normalized.slice(0, 3));
      } catch {
        setRankings([]);
      } finally {
        setLoadingRank(false);
      }
    };
    fetchRanking();
  }, []);

  const features = [
    { icon: <ShieldCheck size={22} />, color: 'emerald', title: 'Penilaian Objektif',  desc: 'Hilangkan bias manusia — setiap keputusan didasari data dan bobot kriteria yang terukur.' },
    { icon: <BarChart3   size={22} />, color: 'indigo',  title: 'Metode SAW',           desc: 'Simple Additive Weighting, algoritma yang ringan namun terbukti akurat untuk seleksi multi-kriteria.' },
    { icon: <Truck       size={22} />, color: 'amber',   title: 'Optimasi Rantai Pasok', desc: 'Pilih mitra terbaik dari ratusan supplier berdasarkan performa nyata, bukan asumsi.' },
  ];

  const stats = [
    { value: '10+',  label: 'Supplier Terdaftar'  },
    { value: '5',   label: 'Kriteria Penilaian'  },
    { value: '99%',  label: 'Akurasi Perhitungan' },
    { value: '2026', label: 'Tahun Dikembangkan'  },
  ];

  const { ref: featRef, inView: featInView } = useInView(0.05);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      {/* ─── HERO ─── */}
      <main id="beranda" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[120px] opacity-50 -translate-y-1/4 translate-x-1/4 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100 rounded-full blur-[100px] opacity-40 translate-y-1/4 -translate-x-1/4 animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col lg:flex-row items-center gap-16">
          {/* Kiri */}
          <div className="flex-1 text-center lg:text-left space-y-7">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span>Intelligent Supply Chain</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[4rem] font-black text-slate-900 tracking-tight leading-[1.05]">
              Pilih Supplier<br />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">
                  Terbaik
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="url(#grad)" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />dengan Data
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              Sistem Pendukung Keputusan berbasis metode SAW untuk evaluasi, standardisasi, dan pemeringkatan supplier secara objektif — tanpa tebak-tebakan.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={() => navigate('/login')}
                className="group inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#cara-kerja"
                className="inline-flex items-center space-x-2 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-bold text-sm px-7 py-3.5 rounded-xl bg-white transition-all"
              >
                <span>Cara Kerja</span>
                <ChevronDown size={15} />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-2 border-t border-slate-100">
              {stats.map((s) => (
                <AnimatedCounter key={s.label} target={s.value} label={s.label} />
              ))}
            </div>
          </div>

          {/* Kanan: Live ranking card */}
          <div className="flex-1 flex justify-center lg:justify-end w-full max-w-sm lg:max-w-none">
            <div className="relative w-full max-w-[400px]">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-3xl scale-110" />
              <div className="absolute inset-0 bg-violet-500/5 rounded-3xl blur-2xl scale-105" />

              <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 shadow-2xl border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:18px_18px]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Hasil Evaluasi</p>
                    <p className="text-white font-bold text-sm mt-0.5">
                      {loadingRank ? 'Memuat...' : period ? `Periode ${period}` : 'Belum ada data'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-bold">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Bulanan</span>
                  </div>
                </div>

                <div className="relative z-10 space-y-2.5 min-h-[200px] flex flex-col justify-center">
                  {loadingRank ? (
                    <div className="flex flex-col items-center justify-center h-[200px] space-y-3">
                      <RefreshCw size={22} className="text-indigo-400 animate-spin" />
                      <p className="text-slate-500 text-xs">Memuat ranking bulanan...</p>
                    </div>
                  ) : rankings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[200px] space-y-3">
                      <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
                        <BarChart3 size={22} className="text-slate-600" />
                      </div>
                      <p className="text-slate-500 text-xs text-center leading-relaxed">
                        Belum ada data ranking<br />untuk bulan ini
                      </p>
                    </div>
                  ) : (
                    rankings.map((item, index) => {
                      const score    = getScore(item);
                      const maxScore = getScore(rankings[0]) || 1;
                      const barWidth = Math.min((score / maxScore) * 100, 100);
                      const { badge, icon } = getRankBadge(index + 1);

                      return (
                        <div
                          key={item.id ?? item.supplier_id ?? index}
                          className={[
                            'flex items-center gap-3 rounded-2xl p-3.5 border transition-all hover:scale-[1.01] cursor-default',
                            rankDelayClass[index] ?? '',
                            index === 0
                              ? 'bg-amber-500/8 border-amber-500/25'
                              : 'bg-white/4 border-white/6 hover:bg-white/7',
                          ].join(' ')}
                        >
                          <div className={`${badge} w-7 h-7 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>
                            {icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-white text-xs font-semibold truncate max-w-[130px]">
                                {getSupplierName(item)}
                              </p>
                              <span className={`text-xs font-black ml-2 flex-shrink-0 ${index === 0 ? 'text-amber-400' : 'text-indigo-300'}`}>
                                {score.toFixed(3)}
                              </span>
                            </div>
                            <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${index === 0 ? 'bg-amber-400' : 'bg-indigo-400'}`}
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                            <p className="text-slate-600 text-[10px] mt-1">Rank #{item.rank ?? index + 1}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bagian bawah disederhanakan, menghapus tulisan Powered By */}
                <div className="relative z-10 mt-4 pt-4 border-t border-white/8 flex items-center justify-end">
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-1 text-indigo-400 text-[10px] font-bold hover:text-indigo-300 transition-colors group"
                  >
                    <span>Lihat laporan lengkap</span>
                    <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Badge Terverifikasi di pojok kiri bawah luar card sudah dihapus */}
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-8">
          <a href="#fitur" className="flex flex-col items-center space-y-1 text-slate-400 hover:text-indigo-500 transition-colors group">
            <span className="text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
            <ChevronDown size={16} className="animate-bounce" />
          </a>
        </div>
      </main>

      {/* ─── FITUR ─── */}
      <section id="fitur" className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={featRef}
            className={[
              'text-center mb-12 transition-all duration-700',
              featInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            ].join(' ')}
          >
            <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-2">Keunggulan Sistem</p>
            <h2 className="text-3xl font-black text-slate-900">Mengapa SPK-Supplier?</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
              Dirancang khusus untuk tim pengadaan yang membutuhkan keputusan cepat, akurat, dan dapat dipertanggungjawabkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delayIndex={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <div id="cara-kerja">
        <HowItWorks />
      </div>

      {/* ─── CTA ─── */}
      <section id="tentang" className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 text-white text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider mb-6">
            <Zap size={11} />
            <span>Siap digunakan sekarang</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Mulai Evaluasi Supplier<br />Hari Ini
          </h2>
          <p className="text-indigo-200 text-base mb-8 max-w-xl mx-auto">
            Masuk ke system dan jalankan penilaian pertamamu dalam hitungan menit. Tidak perlu konfigurasi rumit.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="group inline-flex items-center space-x-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm px-8 py-4 rounded-xl shadow-2xl transition-all active:scale-95"
            >
              <LogIn size={16} />
              <span>Masuk ke Dashboard</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;