import React, { useState } from 'react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import type { User } from './UsersIndex';

interface Props {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserEdit: React.FC<Props> = ({ user, onSuccess, onCancel }) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(user.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}`, { name, username, role });
      toast.success('Data user berhasil diperbarui!');
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
            <label htmlFor="roleSelectEdit" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Hak Akses / Role</label>
            <select
              id="roleSelectEdit" value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
            >
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Manajer">Manajer</option>
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
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;