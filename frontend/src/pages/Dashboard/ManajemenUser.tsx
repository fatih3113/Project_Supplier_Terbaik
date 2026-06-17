import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { UserPlus, Edit2, Trash2, Shield, RefreshCw, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
}

const ManajemenUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk Modal Form (Tambah / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  // State Form Input
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');

  // Ambil data user dari backend saat komponen dimuat
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Buka Modal untuk Tambah User Baru
  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedUserId(null);
    setName('');
    setUsername('');
    setPassword('');
    setRole('Admin');
    setIsModalOpen(true);
  };

  // Buka Modal untuk Edit User
  const openEditModal = (user: User) => {
    setIsEditMode(true);
    setSelectedUserId(user.id);
    setName(user.name);
    setUsername(user.username);
    setPassword(''); // Kosongkan password saat edit kecuali ingin diubah
    setRole(user.role);
    setIsModalOpen(true);
  };

  // Handle Submit (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedUserId) {
        // Mode Update
        await api.put(`/users/${selectedUserId}`, { name, username, role });
        toast.success('Data user berhasil diperbarui!');
      } else {
        // Mode Create
        if (password.trim().length < 8) {
          toast.error('Password baru minimal harus 8 karakter!');
          return;
        }
        await api.post('/users', { name, username, password, role });
        toast.success('User baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan sistem');
    }
  };

  // Handle Hapus User
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

  // Handle Reset Password Cepat ke Default "123456"
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

  return (
    <div className="p-1">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen User</h1>
          <p className="text-slate-500 text-sm">Kelola data administrator dan hak akses pengguna sistem SPK.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10"
        >
          <UserPlus size={16} />
          <span>Tambah User</span>
        </button>
      </div>

      {/* Tabel Data User */}
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
                        <span>{user.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
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

      {/* --- MODAL FORM POP UP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {isEditMode ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                type="button"
                title="Tutup"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Username / NIM</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: 24090002"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              {!isEditMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password (Min. 8 Karakter)</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password acak"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
              )}

              <div>
                <label htmlFor="roleSelect" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Hak Akses / Role</label>
                <select
                  id="roleSelect"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Manajer">Manajer</option>
                </select>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/10 transition-all"
                >
                  {isEditMode ? 'Simpan Perubahan' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenUser;