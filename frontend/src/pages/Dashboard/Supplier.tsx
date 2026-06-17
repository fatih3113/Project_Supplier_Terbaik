import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

interface Supplier {
  id_supplier: number;
  nama_supplier: string;
  alamat: string;
  telepon: string;
  email: string;
}

const Supplier: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id_supplier: null as number | null, nama_supplier: '', alamat: '', telepon: '', email: '' });

  const fetchSuppliers = async () => {
    const res = await api.get('/suppliers');
    setSuppliers(res.data);
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id_supplier) {
      await api.put(`/suppliers/${form.id_supplier}`, form);
    } else {
      await api.post('/suppliers', form);
    }
    setModal(false);
    setForm({ id_supplier: null, nama_supplier: '', alamat: '', telepon: '', email: '' });
    fetchSuppliers();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus supplier ini? Semua nilai terkait juga akan terhapus.')) {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Data Master Supplier</h2>
        <button onClick={() => { setForm({ id_supplier: null, nama_supplier: '', alamat: '', telepon: '', email: '' }); setModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Tambah Supplier
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase font-semibold">
              <th className="p-4">Nama Supplier</th>
              <th className="p-4">Alamat</th>
              <th className="p-4">Telepon</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
            {suppliers.map((s) => (
              <tr key={s.id_supplier} className="hover:bg-gray-50/70">
                <td className="p-4 font-medium text-gray-900">{s.nama_supplier}</td>
                <td className="p-4">{s.alamat}</td>
                <td className="p-4">{s.telepon}</td>
                <td className="p-4">{s.email}</td>
                <td className="p-4 text-center space-x-2">
                  <button onClick={() => { setForm(s as any); setModal(true); }} className="text-amber-600 hover:text-amber-700 font-semibold">Edit</button>
                  <button onClick={() => handleDelete(s.id_supplier)} className="text-rose-600 hover:text-rose-700 font-semibold">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold mb-4">{form.id_supplier ? 'Edit Data Supplier' : 'Tambah Supplier Baru'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nama_supplier" className="block text-sm font-medium text-gray-700">Nama Supplier</label>
                <input id="nama_supplier" type="text" required value={form.nama_supplier} onChange={(e) => setForm({...form, nama_supplier: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"/>
              </div>
              <div>
                <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                <textarea id="alamat" required value={form.alamat} onChange={(e) => setForm({...form, alamat: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm" rows={2}/>
              </div>
              <div>
                <label htmlFor="telepon" className="block text-sm font-medium text-gray-700">Telepon</label>
                <input id="telepon" type="text" required value={form.telepon} onChange={(e) => setForm({...form, telepon: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"/>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border rounded-md text-gray-600">Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;