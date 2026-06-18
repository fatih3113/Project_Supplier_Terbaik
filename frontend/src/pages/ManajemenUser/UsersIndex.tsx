import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { UserPlus, Edit2, Trash2, Shield, RefreshCw } from 'lucide-react';
import UsersCreate from './UsersCreate';
import UsersEdit from './UsersEdit';

export interface User {
  id: number;
  name: string;
  username: string;
  roleId: number;       // Tambahkan ID relasi untuk melempar state ke komponen Edit
  role: {
    name: string;      // Relasi object bungkusan baru dari database
  };
}

const UserIndex: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengambil data user');
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
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Gagal menghapus user');
      }
    }
  };

  const handleResetPassword = async (usernameTarget: string) => {
    if (window.confirm(`Reset password user "${usernameTarget}" menjadi default "123456"?`)) {
      try {
        await api.post('/auth/forgot-password', { username: usernameTarget });
        toast.success(`Password ${usernameTarget} berhasil di-reset menjadi "123456"`);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Gagal mereset password');
      }
    }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setEditTarget(null);
    fetchUsers();
  };

  return (
    <div className="p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen User</h1>
          <p className="text-slate-500 text-sm">Kelola data administrator dan hak akses pengguna sistem SPK.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10"
        >
          <UserPlus size={16} />
          <span>Tambah User</span>
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Username / NIM</th>
                <th className="px-6 py-4">Hak Akses (Role)</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    <span className="inline-block animate-spin mr-2">⏳</span> Memuat data user...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    Belum ada data user.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <Shield size={12} />
                        {/* Membaca string name dari object relasi database */}
                        <span>{user.role?.name || 'No Role'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditTarget(user)}
                          title="Edit User"
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetPassword(user.username)}
                          title="Reset Password ke Default"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id, user.name)}
                          title="Hapus User"
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
};

export default UserIndex;