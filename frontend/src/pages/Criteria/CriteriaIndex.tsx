import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import CriteriaCreate from './CriteriaCreate';
import CriteriaEdit from './CriteriaEdit';
import {
  Plus, Search, Pencil, Trash2, BarChart3,
  RefreshCw, AlertTriangle, TrendingUp, TrendingDown,
  Target, Hash,
} from 'lucide-react';

export interface Criteria {
  id: number;
  nama_kriteria: string;
  bobot: number;
  jenis: string;
}

// ── Badge warna per jenis atribut ─────────────────────────────────────────────
const JenisBadge: React.FC<{ jenis: string }> = ({ jenis }) => {
  const isBenefit = jenis.toLowerCase() === 'benefit';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
        isBenefit
          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
          : 'bg-amber-50 text-amber-700 border-amber-100'
      }`}
    >
      {isBenefit ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {isBenefit ? 'Benefit' : 'Cost'}
    </span>
  );
};

// ── Progress bar bobot ────────────────────────────────────────────────────────
const BobotBar: React.FC<{ bobot: number; maxBobot: number }> = ({ bobot, maxBobot }) => {
  const pct = maxBobot > 0 ? Math.min((bobot / maxBobot) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold text-slate-700 w-8 text-right tabular-nums">
        {bobot}
      </span>
    </div>
  );
};

// ── Modal konfirmasi hapus ────────────────────────────────────────────────────
interface DeleteModalProps {
  criteria: Criteria;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}
const DeleteModal: React.FC<DeleteModalProps> = ({ criteria, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={22} className="text-rose-600" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-base">Hapus Kriteria</p>
          <p className="text-slate-500 text-sm mt-0.5">Tindakan ini tidak bisa dibatalkan</p>
        </div>
      </div>
      <p className="text-slate-600 text-sm mb-5">
        Yakin ingin menghapus kriteria{' '}
        <span className="font-semibold text-slate-800">{criteria.nama_kriteria}</span>?
        Data penilaian terkait juga akan terpengaruh.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
          {loading ? 'Menghapus...' : 'Hapus'}
        </button>
      </div>
    </div>
  </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ onAdd: () => void; filtered: boolean }> = ({ onAdd, filtered }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
      <BarChart3 size={28} className="text-slate-400" />
    </div>
    {filtered ? (
      <>
        <p className="font-semibold text-slate-600 text-sm">Kriteria tidak ditemukan</p>
        <p className="text-slate-400 text-xs mt-1">Coba kata kunci lain</p>
      </>
    ) : (
      <>
        <p className="font-semibold text-slate-700 text-sm">Belum ada kriteria</p>
        <p className="text-slate-400 text-xs mt-1 mb-4">Mulai tambahkan kriteria pembobotan pertama</p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={15} />
          Tambah Kriteria
        </button>
      </>
    )}
  </div>
);

// ── Komponen Utama ────────────────────────────────────────────────────────────
const CriteriaIndex: React.FC = () => {
  const [criteria,      setCriteria]      = useState<Criteria[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [showCreate,    setShowCreate]    = useState(false);
  const [editTarget,    setEditTarget]    = useState<Criteria | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<Criteria | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search,        setSearch]        = useState('');

  const fetchCriteria = async () => {
    setLoading(true);
    try {
      const res = await api.get('/criteria');
      setCriteria(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error('Gagal memuat kriteria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCriteria(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/criteria/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchCriteria();
    } catch (err) {
      console.error('Gagal menghapus:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setEditTarget(null);
    fetchCriteria();
  };

  const filtered = criteria.filter((c) =>
    [c.nama_kriteria, c.jenis, String(c.bobot)]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalBobot   = criteria.reduce((s, c) => s + c.bobot, 0);
  const maxBobot     = Math.max(...criteria.map((c) => c.bobot), 1);
  const countBenefit = criteria.filter((c) => c.jenis.toLowerCase() === 'benefit').length;
  const countCost    = criteria.length - countBenefit;

  return (
    <>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Kriteria Pembobotan</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Kelola kriteria dan bobot kepentingan untuk penilaian SPK
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95 self-start sm:self-auto"
          >
            <Plus size={16} />
            Tambah Kriteria
          </button>
        </div>

        {/* ── Summary chips + Search ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Stat chips */}
          <div className="flex gap-2 flex-shrink-0 flex-wrap">
            {/* Total kriteria */}
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 shadow-sm">
              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Target size={13} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Total</p>
                <p className="text-sm font-black text-slate-800">{criteria.length} Kriteria</p>
              </div>
            </div>

            {/* Total bobot */}
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 shadow-sm">
              <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
                <Hash size={13} className="text-violet-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Total Bobot</p>
                <p className="text-sm font-black text-slate-800">{totalBobot}</p>
              </div>
            </div>

            {/* Benefit */}
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 shadow-sm">
              <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={13} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Benefit</p>
                <p className="text-sm font-black text-slate-800">{countBenefit}</p>
              </div>
            </div>

            {/* Cost */}
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 shadow-sm">
              <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingDown size={13} className="text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Cost</p>
                <p className="text-sm font-black text-slate-800">{countCost}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama kriteria, jenis, atau bobot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* ── Tabel ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <RefreshCw size={18} className="animate-spin" />
              <span className="text-sm">Memuat data kriteria...</span>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onAdd={() => setShowCreate(true)} filtered={search.length > 0} />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Nama Kriteria
                      </th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-48">
                        Bobot
                      </th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Jenis Atribut
                      </th>
                      <th className="text-center py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((c, idx) => (
                      <tr key={c.id} className="hover:bg-slate-50/60 transition-colors group">
                        {/* Nomor urut */}
                        <td className="py-4 px-5">
                          <span className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black text-slate-500">
                            {idx + 1}
                          </span>
                        </td>

                        {/* Nama */}
                        <td className="py-4 px-5">
                          <span className="font-semibold text-slate-800">{c.nama_kriteria}</span>
                        </td>

                        {/* Bobot + bar */}
                        <td className="py-4 px-5 w-48">
                          <BobotBar bobot={c.bobot} maxBobot={maxBobot} />
                        </td>

                        {/* Jenis */}
                        <td className="py-4 px-5">
                          <JenisBadge jenis={c.jenis} />
                        </td>

                        {/* Aksi */}
                        <td className="py-4 px-5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditTarget(c)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-semibold transition-colors border border-amber-100"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(c)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-colors border border-rose-100"
                            >
                              <Trash2 size={12} />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {filtered.map((c, idx) => (
                  <div key={c.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-black text-slate-500 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{c.nama_kriteria}</p>
                          <JenisBadge jenis={c.jenis} />
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditTarget(c)}
                          aria-label="Edit kriteria"
                          className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(c)}
                          aria-label="Hapus kriteria"
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="ml-11">
                      <p className="text-xs text-slate-400 mb-1">Bobot</p>
                      <BobotBar bobot={c.bobot} maxBobot={maxBobot} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer count */}
              <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Menampilkan{' '}
                  <span className="font-semibold text-slate-600">{filtered.length}</span> dari{' '}
                  <span className="font-semibold text-slate-600">{criteria.length}</span> kriteria
                </p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    Reset pencarian
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {showCreate && (
        <CriteriaCreate
          onSuccess={handleSuccess}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editTarget && (
        <CriteriaEdit
          criteria={editTarget}
          onSuccess={handleSuccess}
          onCancel={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          criteria={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default CriteriaIndex;