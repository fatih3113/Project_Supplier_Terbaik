import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { 
  UserPlus, Search, Edit2, Trash2, Shield, 
  RefreshCw, Users,
} from 'lucide-react';
import UsersCreate from './UsersCreate';
import UsersEdit from './UsersEdit';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;       // ← tambah ini
  roleId: number;
  role: {
    name: string;
  };
}

// ── Badge warna per Jenis Role ─────────────────────────────────────────────────
const RoleBadge: React.FC<{ roleName: string }> = ({ roleName }) => {
  const isSuperAdmin = roleName.toLowerCase().includes('super');
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
        isSuperAdmin
          ? 'bg-violet-50 text-violet-700 border-violet-100'
          : 'bg-indigo-50 text-indigo-700 border-indigo-100'
      }`}
    >
      <Shield size={11} />
      {roleName}
    </span>
  );
};

// ── Empty state ────────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ onAdd: () => void; filtered: boolean }> = ({ onAdd, filtered }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
      <Users size={28} className="text-slate-400" />
    </div>
    {filtered ? (
      <>
        <p className="font-semibold text-slate-600 text-sm">User tidak ditemukan</p>
        <p className="text-slate-400 text-xs mt-1">Coba kata kunci atau username lain</p>
      </>
    ) : (
      <>
        <p className="font-semibold text-slate-700 text-sm">Belum ada pengguna</p>
        <p className="text-slate-400 text-xs mt-1 mb-4">Mulai tambahkan administrator atau user baru</p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <UserPlus size={15} />
          Tambah User
        </button>
      </>
    )}
  </div>
);

// ── Komponen Utama ─────────────────────────────────────────────────────────────
const UserIndex: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengambil data user';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number, userName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus user "${userName}"?`)) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User berhasil dihapus');
        fetchUsers();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal menghapus user';
        toast.error(message);
      }
    }
  };

  const handleResetPassword = async (usernameTarget: string) => {
    if (window.confirm(`Reset password user "${usernameTarget}" menjadi default "123456"?`)) {
      try {
        await api.post('/auth/forgot-password', { username: usernameTarget });
        toast.success(`Password ${usernameTarget} berhasil di-reset menjadi "123456"`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal mereset password';
        toast.error(message);
      }
    }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setEditTarget(null);
    fetchUsers();
  };

  const filtered = users.filter((u) =>
    [u.name, u.username, u.role?.name || '']
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const countSuperAdmin = users.filter((u) =>
    u.role?.name?.toLowerCase().includes('super')
  ).length;

  const countAdminToko = users.filter((u) =>
    u.role?.name?.toLowerCase().includes('admin') &&
    !u.role?.name?.toLowerCase().includes('super')
  ).length;

  return (
    <>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Manajemen User</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Kelola data administrator dan hak akses pengguna sistem SPK
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95 self-start sm:self-auto"
          >
            <UserPlus size={16} />
            Tambah User
          </button>
        </div>

        {/* ── Summary chips + Search ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 flex-shrink-0 flex-wrap">

            {/* Total Users */}
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 shadow-sm">
              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users size={13} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Total User</p>
                <p className="text-sm font-black text-slate-800">{users.length} Orang</p>
              </div>
            </div>

            {/* Super Admin */}
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 shadow-sm">
              <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
                <Shield size={13} className="text-violet-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Super Admin</p>
                <p className="text-sm font-black text-slate-800">{countSuperAdmin}</p>
              </div>
            </div>

            {/* Admin Toko */}
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 shadow-sm">
              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Shield size={13} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Admin Toko</p>
                <p className="text-sm font-black text-slate-800">{countAdminToko}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama lengkap, username, NIM, atau role..."
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
              <span className="text-sm">Memuat data user...</span>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onAdd={() => setShowCreate(true)} filtered={search.length > 0} />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">#</th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Username / NIM</th>
                      <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Hak Akses (Role)</th>
                      <th className="text-center py-3.5 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-40">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((user, idx) => (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <span className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black text-slate-500">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-semibold text-slate-800">{user.name}</span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            {user.username}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <RoleBadge roleName={user.role?.name || 'No Role'} />
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditTarget(user)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-semibold transition-colors border border-amber-100"
                            >
                              <Edit2 size={12} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResetPassword(user.username)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors border border-blue-100"
                            >
                              <RefreshCw size={12} />
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(user.id, user.name)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-colors border border-rose-100"
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

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {filtered.map((user, idx) => (
                  <div key={user.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-black text-slate-500 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                          <p className="font-mono text-[11px] text-slate-500">{user.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditTarget(user)}
                          aria-label="Edit user"
                          className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetPassword(user.username)}
                          aria-label="Reset password"
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                        >
                          <RefreshCw size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id, user.name)}
                          aria-label="Hapus user"
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="ml-11 flex items-center gap-2">
                      <span className="text-xs text-slate-400">Akses:</span>
                      <RoleBadge roleName={user.role?.name || 'No Role'} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer counter */}
              <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Menampilkan{' '}
                  <span className="font-semibold text-slate-600">{filtered.length}</span> dari{' '}
                  <span className="font-semibold text-slate-600">{users.length}</span> pengguna
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
        <UsersCreate
          onSuccess={handleSuccess}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editTarget && (
        <UsersEdit
          user={editTarget}
          onSuccess={handleSuccess}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </>
  );
};

export default UserIndex;