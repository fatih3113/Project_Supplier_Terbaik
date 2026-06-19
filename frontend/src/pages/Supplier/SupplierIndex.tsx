import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import SupplierCreate from './SupplierCreate';
import SupplierEdit from './SupplierEdit';
import {
  Plus, Search, Pencil, Trash2, Building2,
  Phone, Mail, MapPin, Users, RefreshCw, AlertTriangle,
} from 'lucide-react';

export interface Supplier {
  id_supplier: number;
  nama_supplier: string;
  alamat: string;
  telepon: string;
  email: string;
}

// ── Avatar warna berdasarkan huruf pertama ────────────────────────────────────
const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-cyan-100 text-cyan-700',
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ── Modal konfirmasi hapus ────────────────────────────────────────────────────
interface DeleteModalProps {
  supplier: Supplier;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}
const DeleteModal: React.FC<DeleteModalProps> = ({ supplier, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Panel */}
    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={22} className="text-rose-600" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-base">Hapus Supplier</p>
          <p className="text-slate-500 text-sm mt-0.5">Tindakan ini tidak bisa dibatalkan</p>
        </div>
      </div>
      <p className="text-slate-600 text-sm mb-5">
        Yakin ingin menghapus{' '}
        <span className="font-semibold text-slate-800">{supplier.nama_supplier}</span>?
        Semua nilai penilaian terkait juga akan terhapus.
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
      <Users size={28} className="text-slate-400" />
    </div>
    {filtered ? (
      <>
        <p className="font-semibold text-slate-600 text-sm">Supplier tidak ditemukan</p>
        <p className="text-slate-400 text-xs mt-1">Coba kata kunci lain</p>
      </>
    ) : (
      <>
        <p className="font-semibold text-slate-700 text-sm">Belum ada supplier</p>
        <p className="text-slate-400 text-xs mt-1 mb-4">Mulai tambahkan supplier pertama</p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={15} />
          Tambah Supplier
        </button>
      </>
    )}
  </div>
);

// ── Komponen Utama ────────────────────────────────────────────────────────────
const SupplierIndex: React.FC = () => {
  const [suppliers,    setSuppliers]    = useState<Supplier[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showCreate,   setShowCreate]   = useState(false);
  const [editTarget,   setEditTarget]   = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search,       setSearch]       = useState('');

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/suppliers');
      setSuppliers(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error('Gagal memuat supplier:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/suppliers/${deleteTarget.id_supplier}`);
      setDeleteTarget(null);
      fetchSuppliers();
    } catch (err) {
      console.error('Gagal menghapus:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setEditTarget(null);
    fetchSuppliers();
  };

  const filtered = suppliers.filter((s) =>
    [s.nama_supplier, s.alamat, s.telepon, s.email]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-5">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Data Supplier</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Kelola daftar mitra supplier yang terdaftar dalam sistem
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95 self-start sm:self-auto"
          >
            <Plus size={16} />
            Tambah Supplier
          </button>
        </div>

        {/* ── Summary + Search bar ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Stat chip */}
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm flex-shrink-0">
            <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Building2 size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-none">Total</p>
              <p className="text-sm font-black text-slate-800">{suppliers.length} Supplier</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, alamat, telepon, atau email..."
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
              <span className="text-sm">Memuat data supplier...</span>
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
                        Supplier
                      </th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Alamat
                      </th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Kontak
                      </th>
                      <th className="text-center py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((s) => (
                      <tr key={s.id_supplier} className="hover:bg-slate-50/60 transition-colors group">
                        {/* Nama */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${avatarColor(s.nama_supplier)}`}>
                              {s.nama_supplier.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800">{s.nama_supplier}</span>
                          </div>
                        </td>
                        {/* Alamat */}
                        <td className="py-4 px-5">
                          <div className="flex items-start gap-1.5 text-slate-500 max-w-[220px]">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0 text-slate-400" />
                            <span className="text-sm leading-snug">{s.alamat || '-'}</span>
                          </div>
                        </td>
                        {/* Kontak */}
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone size={11} className="text-slate-400 flex-shrink-0" />
                              <span className="text-xs">{s.telepon || '-'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Mail size={11} className="text-slate-400 flex-shrink-0" />
                              <span className="text-xs">{s.email || '-'}</span>
                            </div>
                          </div>
                        </td>
                        {/* Aksi */}
                        <td className="py-4 px-5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditTarget(s)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-semibold transition-colors border border-amber-100"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(s)}
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
                {filtered.map((s) => (
                  <div key={s.id_supplier} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-black flex-shrink-0 ${avatarColor(s.nama_supplier)}`}>
                          {s.nama_supplier.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-slate-800 text-sm">{s.nama_supplier}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditTarget(s)}
                          aria-label="Edit supplier"
                          className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          aria-label="Delete supplier"
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5 ml-[52px]">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin size={11} className="text-slate-400" />
                        <span className="text-xs">{s.alamat || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone size={11} className="text-slate-400" />
                        <span className="text-xs">{s.telepon || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail size={11} className="text-slate-400" />
                        <span className="text-xs">{s.email || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer row count */}
              <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Menampilkan <span className="font-semibold text-slate-600">{filtered.length}</span> dari{' '}
                  <span className="font-semibold text-slate-600">{suppliers.length}</span> supplier
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
        <SupplierCreate
          onSuccess={handleSuccess}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editTarget && (
        <SupplierEdit
          supplier={editTarget}
          onSuccess={handleSuccess}
          onCancel={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          supplier={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default SupplierIndex;