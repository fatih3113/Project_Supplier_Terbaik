import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

interface RoleOption {
  id: number;
  name: string;
}

const UserCreate: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<number | string>('');
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Ambil list master role dari database MySQL
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/roles');
        setRoles(res.data);
        if (res.data.length > 0) {
          setRoleId(res.data[0].id); // Default ke role pertama
        }
      } catch (err) {
        toast.error('Gagal memuat tingkatan hak akses');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length < 8) {
      toast.error('Password baru minimal harus 8 karakter!');
      return;
    }
    if (!roleId) {
      toast.error('Role belum siap atau belum dipilih!');
      return;
    }

    try {
      // Kirim data menggunakan roleId (angka) sesuai relasi tabel database baru
      await api.post('/users', { name, username, password, roleId: Number(roleId) });
      toast.success('User baru berhasil ditambahkan!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan sistem');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-base font-bold text-slate-900">Tambah Pengguna Baru</h3>
          <button
            type="button"
            title="Tutup"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Nama Lengkap</label>
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Username / NIM</label>
            <input
              type="text" required value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: 24090002"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password (Min. 8 Karakter)</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password acak"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label htmlFor="roleSelect" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Hak Akses / Role</label>
            <select
              id="roleSelect" 
              value={roleId}
              disabled={loadingRoles}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
            >
              {loadingRoles ? (
                <option>Memuat pilihan role...</option>
              ) : (
                roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))
              )}
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button" onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/10 transition-all"
            >
              Simpan User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreate;