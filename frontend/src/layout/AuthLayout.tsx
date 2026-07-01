import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BarChart3, Truck, ShieldCheck, Star, TrendingUp, RefreshCw } from 'lucide-react';
import api from '../lib/axios';

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

const getSupplierName = (item: RankingItem): string =>
  item.nama_supplier || item.supplier_name || '-';

const getScore = (item: RankingItem): number =>
  safe(item.total_score ?? item.nilai ?? 0);

// ── Raw API response type ─────────────────────────────────────────────────────
interface RankingRaw {
  id?: number;
  supplier_id?: number;
  supplier_name?: string;
  nama_supplier?: string;
  total_score?: number | string;
  nilai?: number | string;
  rank?: number;
  [key: string]: unknown;
}

const AuthLayout: React.FC = () => {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loadingRank, setLoadingRank] = useState(true);
  const [period, setPeriod] = useState('');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const formattedPeriod = `${year}-${month}`;

        const MONTHS_ID = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
        ];
        setPeriod(`${MONTHS_ID[today.getMonth()]} ${year}`);

        const res = await api.get<RankingRaw[] | { data: RankingRaw[] }>(
          '/ranking',
          { params: { period: formattedPeriod } }
        );

        const raw = res.data;
        const data: RankingRaw[] = Array.isArray(raw)
          ? raw
          : (raw as { data: RankingRaw[] }).data ?? [];

        const normalized: RankingItem[] = data.map((item, idx) => ({
          id:           item.id ?? 0,
          supplier_id:  item.supplier_id,
          supplier_name: item.supplier_name,
          nama_supplier: item.nama_supplier || item.supplier_name || '-',
          total_score:  item.total_score ?? item.nilai ?? 0,
          nilai:        item.nilai,
          rank:         item.rank ?? idx + 1,
        }));

        setRankings(normalized.slice(0, 3));
      } catch (error) {
        console.error('Gagal memuat data ranking bulanan di AuthLayout:', error);
        setRankings([]);
      } finally {
        setLoadingRank(false);
      }
    };

    fetchRanking();
  }, []);

  const getBadgeStyle = (rank: number): { bg: string; icon: React.ReactNode } => {
    if (rank === 1) return { bg: 'bg-emerald-500/20 text-emerald-400', icon: <Star size={14} /> };
    if (rank === 2) return { bg: 'bg-indigo-500/20 text-indigo-400', icon: <TrendingUp size={14} /> };
    return { bg: 'bg-amber-500/20 text-amber-400', icon: <ShieldCheck size={14} /> };
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* ─── PANEL KIRI ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex-col">
        {/* Dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.06)_1px,_transparent_0)] bg-[size:28px_28px]" />

        {/* Glow orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />

        {/* Logo */}
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
          <div className="w-full max-w-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl mb-8">

            {/* Header Mini Dashboard */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <BarChart3 size={16} className="text-indigo-400" />
                <span className="text-white text-xs font-bold">
                  {loadingRank ? 'Memuat...' : `Ranking — ${period}`}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-bold">
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                <span>Bulanan</span>
              </div>
            </div>

            {/* List Ranking */}
            <div className="space-y-2.5 min-h-[180px] flex flex-col justify-center">
              {loadingRank ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <RefreshCw size={20} className="text-indigo-400 animate-spin" />
                  <p className="text-slate-400 text-[11px]">Sinkronisasi data...</p>
                </div>
              ) : rankings.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-xs">Belum ada data ranking periode ini</p>
                </div>
              ) : (
                rankings.map((item, index) => {
                  const score    = getScore(item);
                  const maxScore = getScore(rankings[0]) || 1;
                  const barWidth = Math.min((score / maxScore) * 100, 100);
                  const badge    = getBadgeStyle(index + 1);

                  return (
                    <div
                      key={item.id ?? item.supplier_id ?? index}
                      className={`bg-white/5 rounded-xl p-3 border border-white/5 transition-all duration-300 ${
                        index === 0 ? 'bg-indigo-950/40 border-indigo-500/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-3 text-left min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${badge.bg}`}>
                            {badge.icon}
                          </div>
                          <div className="truncate">
                            <p className="text-white text-xs font-semibold truncate max-w-[150px]">
                              {getSupplierName(item)}
                            </p>
                            <p className="text-indigo-300 text-[10px]">Rank #{item.rank ?? index + 1}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-black flex-shrink-0 ml-2 ${index === 0 ? 'text-amber-400' : 'text-indigo-300'}`}>
                          {score.toFixed(3)}
                        </span>
                      </div>

                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            index === 0 ? 'bg-amber-400' : 'bg-indigo-400'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
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
            <span className="text-slate-400 text-xs">Kelompok 2 &mdash; SUPPLIER TERBAIK 2026</span>
          </div>
        </div>
      </div>

      {/* ─── PANEL KANAN: Form Auth ─── */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-12 sm:px-12 lg:px-16">
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