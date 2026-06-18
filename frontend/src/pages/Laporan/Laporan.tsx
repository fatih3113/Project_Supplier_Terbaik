import React, { useEffect, useState, useRef } from 'react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Download,
  Printer,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface RankingItem {
  id: number;
  supplier_id: number;
  supplier_name: string;
  total_score: number | string;
  rank: number;
  period?: string;
}

interface CriteriaItem {
  id: number;
  name?: string;
  criteria_name?: string;
  weight?: number | string;
  bobot?: number | string;
  type?: string;
  jenis?: string;
}

interface AssessmentDetail {
  id?: number;
  supplierId?: number;
  criteriaId?: number;
  supplier_name?: string;
  supplier?: any;
  criteria_name?: string;
  criteria?: any;
  value?: number | string;
  nilai?: number | string;
  normalized?: number | string;
  normalized_value?: number | string;
  nilai_normal?: number | string; // Tambahan snake_case backend
  weighted?: number | string;
  weighted_value?: number | string;
  nilai_terbobot?: number | string; // Tambahan snake_case backend
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const safe = (val: unknown): number => {
  if (val === null || val === undefined || val === '') return 0;
  const n = parseFloat(String(val));
  return isNaN(n) ? 0 : n;
};

const getCriteriaName = (c: CriteriaItem): string =>
  c.criteria_name || c.name || `Kriteria ${c.id}`;

const getCriteriaWeight = (c: CriteriaItem): number =>
  safe(c.bobot ?? c.weight ?? 0);

const getCriteriaType = (c: CriteriaItem): string =>
  (c.jenis || c.type || 'benefit').toLowerCase();

const getSupplierName = (a: AssessmentDetail): string => {
  if (a.supplier && typeof a.supplier === 'object') {
    return a.supplier.nama_supplier || a.supplier.name || '-';
  }
  if (a.supplier_name) return a.supplier_name;
  return typeof a.supplier === 'string' ? a.supplier : '-';
};

const getAssessmentCriteria = (a: AssessmentDetail): string => {
  if (a.criteria && typeof a.criteria === 'object') {
    return a.criteria.nama_kriteria || a.criteria.criteria_name || a.criteria.name || '-';
  }
  if (a.criteria_name) return a.criteria_name;
  return typeof a.criteria === 'string' ? a.criteria : '-';
};

const getAssessmentValue = (a: AssessmentDetail): number =>
  safe(a.nilai ?? a.value ?? 0);

// 🛠️ Perbaikan ekstraksi data normalisasi sesuai output backend
const getAssessmentNormalized = (a: AssessmentDetail): number =>
  safe(a.nilai_normal ?? a.normalized ?? a.normalized_value ?? 0);

// 🛠️ Perbaikan ekstraksi data bobot sesuai output backend
const getAssessmentWeighted = (a: AssessmentDetail): number =>
  safe(a.nilai_terbobot ?? a.weighted ?? a.weighted_value ?? 0);

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy size={16} className="text-amber-400" />;
  if (rank === 2) return <Trophy size={16} className="text-slate-400" />;
  if (rank === 3) return <Trophy size={16} className="text-amber-600" />;
  return <span className="text-slate-500 font-bold text-sm">#{rank}</span>;
};

const getScoreColor = (score: number) => {
  if (score >= 0.8) return 'text-emerald-600';
  if (score >= 0.6) return 'text-indigo-600';
  if (score >= 0.4) return 'text-amber-600';
  return 'text-rose-500';
};

const getBarColor = (score: number) => {
  if (score >= 0.8) return 'bg-emerald-500';
  if (score >= 0.6) return 'bg-indigo-500';
  if (score >= 0.4) return 'bg-amber-500';
  return 'bg-rose-500';
};

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// ── Sub-Komponen Terpisah ───────────────────────────────────────────────────

interface TabRankingProps {
  rankings: RankingItem[];
  period: string;
}
const TabRanking: React.FC<TabRankingProps> = ({ rankings, period }) => (
  <div>
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-base font-bold text-slate-800">Hasil Ranking Supplier — Metode SAW</h2>
      <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{period}</span>
    </div>
    {rankings.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <FileText size={40} className="mb-3 opacity-30" />
        <p className="text-sm">Belum ada data ranking tersedia</p>
      </div>
    ) : (
      <div className="space-y-3">
        {rankings.map((item, index) => {
          const score = safe(item.total_score);
          const maxScore = safe(rankings[0]?.total_score) || 1;
          const barWidth = Math.min((score / maxScore) * 100, 100);
          return (
            <div
              key={item.id ?? item.supplier_id ?? index}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                index === 0
                  ? 'border-amber-200 bg-amber-50/50'
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-10 flex justify-center flex-shrink-0">
                {getRankIcon(item.rank || index + 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.supplier_name || '-'}</p>
                  <span className={`text-sm font-black ml-3 ${getScoreColor(score)}`}>{score.toFixed(4)}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getBarColor(score)}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                {index === 0 ? (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">TERBAIK</span>
                ) : score >= safe(rankings[0]?.total_score) * 0.75 ? (
                  <TrendingUp size={14} className="text-emerald-500" />
                ) : score >= safe(rankings[0]?.total_score) * 0.5 ? (
                  <Minus size={14} className="text-amber-500" />
                ) : (
                  <TrendingDown size={14} className="text-rose-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

interface TabPenilaianProps {
  assessments: AssessmentDetail[];
}
const TabPenilaian: React.FC<TabPenilaianProps> = ({ assessments }) => (
  <div>
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-base font-bold text-slate-800">Detail Nilai per Supplier</h2>
    </div>
    {assessments.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <FileText size={40} className="mb-3 opacity-30" />
        <p className="text-sm">Belum ada data penilaian tersedia</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['Supplier', 'Kriteria', 'Nilai Asli', 'Nilai Normal', 'Nilai Terbobot'].map((h) => (
                <th
                  key={h}
                  className={`py-3 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider ${
                    h === 'Supplier' || h === 'Kriteria' ? 'text-left' : 'text-center'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assessments.map((a, i) => (
              <tr key={a.id ?? i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 font-medium text-slate-700">{getSupplierName(a)}</td>
                <td className="py-3 px-3 text-slate-500">{getAssessmentCriteria(a)}</td>
                <td className="py-3 px-3 text-center text-slate-700">{getAssessmentValue(a)}</td>
                <td className="py-3 px-3 text-center text-indigo-600 font-medium">{getAssessmentNormalized(a).toFixed(4)}</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">{getAssessmentWeighted(a).toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

interface TabKriteriaProps {
  criteria: CriteriaItem[];
  totalBobot: number;
}
const TabKriteria: React.FC<TabKriteriaProps> = ({ criteria, totalBobot }) => (
  <div>
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-base font-bold text-slate-800">Bobot & Jenis Kriteria SAW</h2>
      <div className="flex items-center space-x-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
        <CheckCircle2 size={13} />
        <span>Total Bobot: {totalBobot.toFixed(0)}%</span>
      </div>
    </div>
    {criteria.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <FileText size={40} className="mb-3 opacity-30" />
        <p className="text-sm">Belum ada kriteria tersedia</p>
      </div>
    ) : (
      <div className="space-y-3">
        {criteria.map((c, i) => {
          const weight = getCriteriaWeight(c);
          const name = getCriteriaName(c);
          const type = getCriteriaType(c);
          const isBenefit = type === 'benefit';
          const barPct = totalBobot > 0 ? (weight / totalBobot) * 100 : weight;
          return (
            <div key={c.id ?? i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-indigo-600">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-slate-800">{name}</p>
                  <span className="text-sm font-black text-indigo-600 ml-3">{weight}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(barPct, 100)}%` }} />
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${isBenefit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                {isBenefit ? 'BENEFIT' : 'COST'}
              </span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

// ── Kalender Baru Berbasis Tanggal (Lengkap dengan Hari & Shortcut) ───────────
interface CalendarPickerProps {
  calMonth: number;
  calYear: number;
  selectedDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
  handleSelectDate: (date: number) => void;
  handleShortcut: (type: 'today' | 'yesterday') => void;
  setShowCalendar: (show: boolean) => void;
}
const CalendarPicker: React.FC<CalendarPickerProps> = ({
  calMonth, calYear, selectedDate, prevMonth, nextMonth, handleSelectDate, handleShortcut, setShowCalendar
}) => {
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay();

  const blanks = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const gridCells = [...blanks, ...days];

  return (
    <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-72">
      <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={() => handleShortcut('today')}
          className="py-1.5 px-3 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          Hari Ini
        </button>
        <button
          type="button"
          onClick={() => handleShortcut('yesterday')}
          className="py-1.5 px-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
        >
          Hari Kemarin
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Bulan sebelumnya"
          title="Bulan sebelumnya"
        >
          <ChevronLeft size={16} className="text-slate-500" />
        </button>
        <span className="text-xs font-bold text-slate-700">{MONTHS_ID[calMonth]} {calYear}</span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Bulan berikutnya"
          title="Bulan berikutnya"
        >
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAYS_SHORT.map((d) => (
          <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {gridCells.map((day, idx) => {
          if (day === null) return <div key={`blank-${idx}`} />;
          
          const isSelected = 
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === calMonth &&
            selectedDate.getFullYear() === calYear;

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleSelectDate(day)}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected 
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25' 
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <button type="button" onClick={() => setShowCalendar(false)} className="mt-3 w-full py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors border-t border-slate-50 pt-2">
        Tutup
      </button>
    </div>
  );
};

// ── Komponen Utama Laporan ───────────────────────────────────────────────────
const Laporan: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [criteria, setCriteria] = useState<CriteriaItem[]>([]);
  const [assessments, setAssessments] = useState<AssessmentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ranking' | 'penilaian' | 'kriteria'>('ranking');

  const calRef = useRef<HTMLDivElement>(null);

  const period = `${selectedDate.getDate()} ${MONTHS_ID[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        
        const [r, c, a] = await Promise.all([
          api.get('/ranking', { params: { date: formattedDate } }),
          api.get('/criteria'),
          api.get('/assessment', { params: { date: formattedDate } }),
        ]);

        // Parsing data terintegrasi map array prisma-client
        const rankData = Array.isArray(r.data) ? r.data : r.data?.data || [];
        const critData = Array.isArray(c.data) ? c.data : c.data?.data || [];
        const assData = Array.isArray(a.data) ? a.data : a.data?.data || [];

        // Penyesuaian mapping model jika property backend berbeda
        const mappedRank = rankData.map((item: any) => ({
          ...item,
          supplier_name: item.nama_supplier || item.supplier_name || '-',
          total_score: item.nilai !== undefined ? item.nilai : item.total_score
        }));

        setRankings(mappedRank);
        setCriteria(critData);
        setAssessments(assData);
      } catch (err: any) {
        console.error('Gagal memuat data laporan:', err);
        toast.error('Gagal memuat data dari server');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [selectedDate]);

  const handlePrint = () => window.print();
  const handleExportPDF = () => window.print();
  const totalBobot = criteria.reduce((sum, c) => sum + getCriteriaWeight(c), 0);

  const handleSelectDate = (day: number) => {
    const targetDate = new Date(calYear, calMonth, day);
    setSelectedDate(targetDate);
    setShowCalendar(false);
  };

  const handleShortcut = (type: 'today' | 'yesterday') => {
    const target = new Date();
    if (type === 'yesterday') {
      target.setDate(target.getDate() - 1);
    }
    setSelectedDate(target);
    setCalMonth(target.getMonth());
    setCalYear(target.getFullYear());
    setShowCalendar(false);
  };

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3 text-slate-400">
          <RefreshCw size={20} className="animate-spin" />
          <span className="text-sm">Memuat data laporan tanggal {period}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Laporan SPK</h1>
          <p className="text-slate-500 text-sm mt-0.5">Hasil evaluasi pemilihan supplier terbaik menggunakan metode SAW</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={calRef}>
            <button
              type="button"
              onClick={() => {
                setCalMonth(selectedDate.getMonth());
                setCalYear(selectedDate.getFullYear());
                setShowCalendar((v) => !v);
              }}
              className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 cursor-pointer hover:border-indigo-400 transition-colors"
            >
              <Calendar size={15} className="text-slate-400" />
              <span className="font-semibold">{period}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {showCalendar && (
              <CalendarPicker
                calMonth={calMonth}
                calYear={calYear}
                selectedDate={selectedDate}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
                handleSelectDate={handleSelectDate}
                handleShortcut={handleShortcut}
                setShowCalendar={setShowCalendar}
              />
            )}
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <Printer size={15} />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/25"
          >
            <Download size={15} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ── Print Header ── */}
      <div className="hidden print-header">
        <div className="text-center mb-6 pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-800">Laporan SPK</h1>
          <p className="text-slate-500 text-sm mt-1">Hasil evaluasi pemilihan supplier terbaik menggunakan metode SAW</p>
          <p className="text-slate-400 text-xs mt-1">Tanggal Evaluasi: {period}</p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Supplier</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{rankings.length}</p>
          <p className="text-xs text-slate-400 mt-1">Dievaluasi</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Kriteria</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{criteria.length}</p>
          <p className="text-xs text-slate-400 mt-1">Digunakan</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Skor Tertinggi</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {rankings.length > 0 ? safe(rankings[0]?.total_score).toFixed(3) : '-'}
          </p>
          <p className="text-xs text-slate-400 mt-1 truncate">{rankings[0]?.supplier_name || '-'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tanggal Data</p>
          <p className="text-lg font-black text-indigo-600 mt-1 leading-tight">{period}</p>
          <p className="text-xs text-slate-400 mt-1">Laporan aktif</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 no-print">
          <div className="flex">
            {[
              { key: 'ranking', label: 'Ranking Supplier' },
              { key: 'penilaian', label: 'Detail Penilaian' },
              { key: 'kriteria', label: 'Bobot Kriteria' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className={activeTab === 'ranking' ? 'block' : 'hidden print-show'}>
            <TabRanking rankings={rankings} period={period} />
          </div>

          <div className={activeTab === 'penilaian' ? 'block' : 'hidden print-show'}>
            <div className="hidden print-separator my-6 border-t border-slate-200" />
            <TabPenilaian assessments={assessments} />
          </div>

          <div className={activeTab === 'kriteria' ? 'block' : 'hidden print-show'}>
            <div className="hidden print-separator my-6 border-t border-slate-200" />
            <TabKriteria criteria={criteria} totalBobot={totalBobot} />
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          nav, aside, header, footer, .no-print { display: none !important; }
          .print-header  { display: block !important; }
          .print-show    { display: block !important; }
          .print-separator { display: block !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { margin: 20mm 15mm; }
          body { font-size: 12px; }
          .space-y-3 > div, tr { break-inside: avoid; page-break-inside: avoid; }
          table { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default Laporan;