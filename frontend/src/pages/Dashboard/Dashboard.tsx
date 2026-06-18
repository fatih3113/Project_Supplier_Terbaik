import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import {
  Users, Sliders, ClipboardCheck, Trophy,
  TrendingUp, ArrowUpRight, Zap, ChevronRight,
  BarChart2, Target, Award, Activity
} from 'lucide-react';

// ---------- Animated Counter ----------
const AnimatedCounter: React.FC<{ target: number | string; duration?: number }> = ({
  target,
  duration = 1200,
}) => {
  const [display, setDisplay] = useState<number | string>(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (typeof target === 'string') { setDisplay(target); return; }
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * (target as number)));
      if (progress < 1) raf.current = requestAnimationFrame(step);
      else setDisplay(target);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return <>{display}</>;
};

// ---------- Sparkline SVG ----------
const Sparkline: React.FC<{ values: number[]; colorClass: string }> = ({ values, colorClass }) => {
  const w = 80, h = 32;
  const max = Math.max(...values, 1);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-60">
      <polyline
        points={pts}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={colorClass}
      />
    </svg>
  );
};

// ---------- Card color config ----------
type CardColor = 'blue' | 'violet' | 'amber' | 'emerald';

const cardConfig: Record<CardColor, {
  gradient: string;
  iconBg: string;
  iconText: string;
  sparkStroke: string;
  orb: string;
}> = {
  blue: {
    gradient: 'bg-gradient-to-br from-blue-600 to-blue-800',
    iconBg: 'bg-blue-400/20 border border-blue-300/25',
    iconText: 'text-blue-300',
    sparkStroke: 'stroke-blue-300',
    orb: 'bg-blue-300',
  },
  violet: {
    gradient: 'bg-gradient-to-br from-violet-600 to-violet-800',
    iconBg: 'bg-violet-400/20 border border-violet-300/25',
    iconText: 'text-violet-300',
    sparkStroke: 'stroke-violet-300',
    orb: 'bg-violet-300',
  },
  amber: {
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-700',
    iconBg: 'bg-amber-400/20 border border-amber-300/25',
    iconText: 'text-amber-300',
    sparkStroke: 'stroke-amber-300',
    orb: 'bg-amber-300',
  },
  emerald: {
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    iconBg: 'bg-emerald-400/20 border border-emerald-300/25',
    iconText: 'text-emerald-300',
    sparkStroke: 'stroke-emerald-300',
    orb: 'bg-emerald-300',
  },
};

// ---------- Activity color config ----------
type ActivityColor = 'blue' | 'violet' | 'amber' | 'emerald' | 'rose';

const activityConfig: Record<ActivityColor, { bg: string; text: string }> = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-500'    },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-500'  },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-500'   },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-500' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-500'    },
};

// ---------- Progress bar color config ----------
type BarColor = 'blue' | 'violet' | 'amber';

const barConfig: Record<BarColor, string> = {
  blue:   'bg-blue-500',
  violet: 'bg-violet-500',
  amber:  'bg-amber-500',
};

// ---------- Stat Card ----------
interface CardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  color: CardColor;
  sparkData: number[];
  label: string;
  delay: number;
}

const StatCard: React.FC<CardProps> = ({ title, count, icon, color, sparkData, label, delay }) => {
  const [visible, setVisible] = useState(false);
  const cfg = cardConfig[color];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border border-white/10 shadow-lg
        transition-all duration-700 ${cfg.gradient}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {/* Background orb */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl ${cfg.orb}`} />

      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${cfg.iconBg}`}>
          <span className={cfg.iconText}>{icon}</span>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-white/70">
          {label}
        </span>
      </div>

      <p className="text-sm font-medium text-white/60 mb-0.5 uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-black text-white tracking-tight leading-none">
        <AnimatedCounter target={count} />
      </p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
        <Sparkline values={sparkData} colorClass={cfg.sparkStroke} />
        <div className="flex items-center gap-1 text-xs font-semibold text-white/50">
          <TrendingUp size={12} />
          <span>Aktif</span>
        </div>
      </div>
    </div>
  );
};

// ---------- Activity Row ----------
interface ActivityRowProps {
  icon: React.ReactNode;
  text: string;
  time: string;
  color: ActivityColor;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ icon, text, time, color }) => {
  const cfg = activityConfig[color];
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 group">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
        <span className={cfg.text}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 font-medium truncate">{text}</p>
      </div>
      <span className="text-xs text-slate-400 flex-shrink-0">{time}</span>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
    </div>
  );
};

// ---------- Progress Bar ----------
interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color: BarColor;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max, color }) => {
  const barRef = useRef<HTMLDivElement | null>(null);
  const cfg = barConfig[color];

  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.width = `${(value / max) * 100}%`;
      }
    }, 400);
    return () => clearTimeout(t);
  }, [value, max]);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-400">{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          ref={barRef}
          className={`h-full w-0 rounded-full transition-all duration-1000 ease-out ${cfg}`}
        />
      </div>
    </div>
  );
};

// ---------- Main Dashboard ----------
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ suppliers: 0, criteria: 0, assessments: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [s, c, a] = await Promise.all([
          api.get('/suppliers'),
          api.get('/criteria'),
          api.get('/assessment'),
        ]);
        setStats({
          suppliers: s.data.length,
          criteria: c.data.length,
          assessments: a.data.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards: CardProps[] = [
    {
      title: 'Total Supplier',
      count: stats.suppliers,
      icon: <Users size={20} />,
      color: 'blue',
      sparkData: [2, 4, 3, 6, 5, stats.suppliers || 7],
      label: 'Data Master',
      delay: 0,
    },
    {
      title: 'Kriteria Penilaian',
      count: stats.criteria,
      icon: <Sliders size={20} />,
      color: 'violet',
      sparkData: [1, 2, 2, 3, 3, stats.criteria || 4],
      label: 'Bobot SAW',
      delay: 100,
    },
    {
      title: 'Data Penilaian',
      count: stats.assessments,
      icon: <ClipboardCheck size={20} />,
      color: 'amber',
      sparkData: [3, 7, 5, 10, 8, stats.assessments || 12],
      label: 'Matriks Nilai',
      delay: 200,
    },
    {
      title: 'Metode Aktif',
      count: 'SAW',
      icon: <Trophy size={20} />,
      color: 'emerald',
      sparkData: [5, 5, 5, 5, 5, 5],
      label: 'Algoritma',
      delay: 300,
    },
  ];

  const activities: ActivityRowProps[] = [
    { icon: <Users size={14} />,         text: 'Supplier baru ditambahkan ke sistem',   time: 'Baru saja', color: 'blue'    },
    { icon: <Sliders size={14} />,        text: 'Bobot kriteria "Harga" diperbarui',     time: '5m lalu',   color: 'violet'  },
    { icon: <ClipboardCheck size={14} />, text: 'Penilaian supplier PT Maju diinput',    time: '1j lalu',   color: 'amber'   },
    { icon: <Award size={14} />,          text: 'Perangkingan SPK berhasil dihitung',    time: '3j lalu',   color: 'emerald' },
    { icon: <Activity size={14} />,       text: 'Laporan bulan ini diekspor ke PDF',     time: 'Kemarin',   color: 'rose'    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-1">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            <Zap size={11} />
            SPK Supplier Terbaik
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Selamat Datang,{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Admin
          </span>{' '}
          👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Pantau dan kelola seluruh data sistem pengambilan keputusan pemilihan supplier dari sini.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Kelengkapan Data */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kelengkapan Data Sistem</h2>
              <p className="text-xs text-slate-400 mt-0.5">Status pengisian data untuk perhitungan SPK</p>
            </div>
            <div className="p-2 rounded-xl bg-indigo-50">
              <BarChart2 size={18} className="text-indigo-500" />
            </div>
          </div>

          <ProgressBar label="Data Supplier"            value={stats.suppliers}   max={Math.max(stats.suppliers + 3, 10)}   color="blue"   />
          <ProgressBar label="Kriteria Penilaian"       value={stats.criteria}    max={Math.max(stats.criteria + 2, 8)}     color="violet" />
          <ProgressBar label="Matriks Nilai"            value={stats.assessments} max={Math.max(stats.assessments + 5, 20)} color="amber"  />

          {/* CTA */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-sm">Siap hitung perangkingan?</p>
              <p className="text-white/70 text-xs">Pastikan semua data sudah lengkap terlebih dahulu.</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/penilaian')}
              className="flex items-center justify-center gap-1.5 text-xs font-bold bg-white text-indigo-600 h-10 w-full sm:w-36 rounded-lg shadow hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
            >
              <Target size={13} />
              Hitung Sekarang
            </button>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Aktivitas Terbaru</h2>
              <p className="text-xs text-slate-400 mt-0.5">Log perubahan sistem</p>
            </div>
            <button className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all">
              Lihat semua <ArrowUpRight size={12} />
            </button>
          </div>
          {activities.map((act, i) => (
            <ActivityRow key={i} {...act} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;