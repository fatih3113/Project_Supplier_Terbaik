import React, { useState } from 'react';
import api from '../../lib/axios';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const SupplierCreate: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    nama_supplier: '',
    alamat: '',
    telepon: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/suppliers', form);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
        <h3 className="text-lg font-bold mb-4">Tambah Supplier Baru</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nama_supplier" className="block text-sm font-medium text-gray-700">Nama Supplier</label>
            <input
              id="nama_supplier" type="text" required
              value={form.nama_supplier}
              onChange={(e) => setForm({ ...form, nama_supplier: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
            <textarea
              id="alamat" required rows={2}
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="telepon" className="block text-sm font-medium text-gray-700">Telepon</label>
            <input
              id="telepon" type="text" required
              value={form.telepon}
              onChange={(e) => setForm({ ...form, telepon: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email" type="email" required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md text-gray-600">Batal</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierCreate;