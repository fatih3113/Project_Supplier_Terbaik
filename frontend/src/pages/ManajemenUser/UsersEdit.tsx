import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import type { User } from './UsersIndex';

interface Props {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

interface RoleOption {
  id: number;
  name: string;
}

const UsersEdit: React.FC<Props> = ({ user, onSuccess, onCancel }) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email ?? '');
  const [roleId, setRoleId] = useState<number>(user.roleId);
  const [roles, setRoles] = useState<RoleOption[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/roles');
        setRoles(res.data);
      } catch {
        toast.error('Gagal mengambil data master role');
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}`, {
        name,
        username,
        email,
        roleId: Number(roleId),
      });
      toast.success('Data user berhasil diperbarui!');
      onSuccess();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Terjadi kesalahan sistem');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-base font-bold text-slate-900">Edit Data Pengguna</h3>
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

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Nama Lengkap
            </label>
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Username / NIM
            </label>
            <input
              type="text" required value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: 24090002"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Alamat Gmail
            </label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@gmail.com"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Digunakan untuk reset password jika lupa.
            </p>
          </div>

          {/* Role */}
          <div>
            <label htmlFor="roleSelectEdit" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Hak Akses / Role
            </label>
            <select
              id="roleSelectEdit"
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-2">
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
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersEdit;