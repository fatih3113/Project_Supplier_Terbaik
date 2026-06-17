import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

interface Supplier { id_supplier: number; nama_supplier: string; }
interface Criteria { id: number; nama_kriteria: string; }
interface AssessmentData { id: number; supplierId: number; criteriaId: number; nilai: number; supplier: Supplier; criteria: Criteria; }

const Assessment: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [form, setForm] = useState({ supplierId: '', criteriaId: '', nilai: '' });

  const loadAllData = async () => {
    const [a, s, c] = await Promise.all([
      api.get('/assessment'),
      api.get('/suppliers'),
      api.get('/criteria')
    ]);
    setAssessments(a.data);
    setSuppliers(s.data);
    setCriteria(c.data);
  };

  useEffect(() => { loadAllData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/assessment', form);
    setForm({ supplierId: '', criteriaId: '', nilai: '' });
    loadAllData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus penilaian ini?')) {
      await api.delete(`/assessment/${id}`);
      loadAllData();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Input / Update Matriks Nilai</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">Pilih Supplier</label>
            <select id="supplierId" title="Pilih Supplier" required value={form.supplierId} onChange={(e) => setForm({...form, supplierId: e.target.value})} className="mt-1 block w-full border rounded-md p-2">
              <option value="">-- Pilih --</option>
              {suppliers.map(s => <option key={s.id_supplier} value={s.id_supplier}>{s.nama_supplier}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="criteriaId" className="block text-sm font-medium text-gray-700">Pilih Kriteria</label>
            <select id="criteriaId" title="Pilih Kriteria" required value={form.criteriaId} onChange={(e) => setForm({...form, criteriaId: e.target.value})} className="mt-1 block w-full border rounded-md p-2">
              <option value="">-- Pilih --</option>
              {criteria.map(c => <option key={c.id} value={c.id}>{c.nama_kriteria}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="nilai" className="block text-sm font-medium text-gray-700">Nilai (1 - 100)</label>
            <input id="nilai" title="Masukkan nilai 1 hingga 100" type="number" required min="0" max="100" value={form.nilai} onChange={(e) => setForm({...form, nilai: e.target.value})} className="mt-1 block w-full border rounded-md p-2"/>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium">Simpan Penilaian</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Matriks Penilaian Terdaftar</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold">
              <th className="p-3">Supplier</th>
              <th className="p-3">Kriteria</th>
              <th className="p-3">Nilai</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {assessments.map((a) => (
              <tr key={a.id}>
                <td className="p-3 font-medium">{a.supplier?.nama_supplier}</td>
                <td className="p-3">{a.criteria?.nama_kriteria}</td>
                <td className="p-3 font-bold text-indigo-600">{a.nilai}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(a.id)} className="text-rose-600 font-medium">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assessment;