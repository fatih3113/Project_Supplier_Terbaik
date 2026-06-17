import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

interface Criteria {
  id: number;
  nama_kriteria: string;
  bobot: number;
  jenis: string;
}

const Criteria: React.FC = () => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id: null as number | null, nama_kriteria: '', bobot: 0, jenis: 'benefit' });

  const fetchCriteria = async () => {
    const res = await api.get('/criteria');
    setCriteria(res.data);
  };

  useEffect(() => { fetchCriteria(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await api.put(`/criteria/${form.id}`, form);
    } else {
      await api.post('/criteria', form);
    }
    setModal(false);
    setForm({ id: null, nama_kriteria: '', bobot: 0, jenis: 'benefit' });
    fetchCriteria();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus kriteria ini?')) {
      await api.delete(`/criteria/${id}`);
      fetchCriteria();
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Kriteria Pembobotan SPK</h2>
        <button onClick={() => { setForm({ id: null, nama_kriteria: '', bobot: 0, jenis: 'benefit' }); setModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Tambah Kriteria
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold">
            <th className="p-4">Nama Kriteria</th>
            <th className="p-4">Bobot Kepentingan</th>
            <th className="p-4">Jenis Atribut</th>
            <th className="p-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
          {criteria.map((c) => (
            <tr key={c.id}>
              <td className="p-4 font-medium">{c.nama_kriteria}</td>
              <td className="p-4">{c.bobot}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.jenis === 'benefit' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {c.jenis}
                </span>
              </td>
              <td className="p-4 text-center space-x-2">
                <button onClick={() => { setForm(c as any); setModal(true); }} className="text-amber-600 font-semibold">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="text-rose-600 font-semibold">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">{form.id ? 'Edit Kriteria' : 'Tambah Kriteria'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nama_kriteria" className="block text-sm font-medium text-gray-700">Nama Kriteria</label>
                <input id="nama_kriteria" type="text" required value={form.nama_kriteria} onChange={(e) => setForm({...form, nama_kriteria: e.target.value})} className="mt-1 block w-full border rounded-md p-2"/>
              </div>
              <div>
                <label htmlFor="bobot" className="block text-sm font-medium text-gray-700">Bobot Nilai</label>
                <input id="bobot" type="number" step="0.01" required value={form.bobot} onChange={(e) => setForm({...form, bobot: Number(e.target.value)})} className="mt-1 block w-full border rounded-md p-2"/>
              </div>
              <div>
                <label htmlFor="jenis" className="block text-sm font-medium text-gray-700">Jenis Kriteria</label>
                <select id="jenis" value={form.jenis} onChange={(e) => setForm({...form, jenis: e.target.value})} className="mt-1 block w-full border rounded-md p-2">
                  <option value="benefit">Benefit</option>
                  <option value="cost">Cost</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Criteria;