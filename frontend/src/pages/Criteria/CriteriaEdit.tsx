import React, { useState } from 'react';
import api from '../../lib/axios';
import type { Criteria } from './CriteriaIndex';

interface Props {
  criteria: Criteria;
  onSuccess: () => void;
  onCancel: () => void;
}

const CriteriaEdit: React.FC<Props> = ({ criteria, onSuccess, onCancel }) => {
  const [form, setForm] = useState({ ...criteria });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`/criteria/${form.id}`, form);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-4">Edit Kriteria</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nama_kriteria_edit" className="block text-sm font-medium text-gray-700">Nama Kriteria</label>
            <input
              id="nama_kriteria_edit" type="text" required
              value={form.nama_kriteria}
              onChange={(e) => setForm({ ...form, nama_kriteria: e.target.value })}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="bobot_edit" className="block text-sm font-medium text-gray-700">Bobot Nilai</label>
            <input
              id="bobot_edit" type="number" step="0.01" required
              value={form.bobot}
              onChange={(e) => setForm({ ...form, bobot: Number(e.target.value) })}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="jenis_edit" className="block text-sm font-medium text-gray-700">Jenis Kriteria</label>
            <select
              id="jenis_edit"
              value={form.jenis}
              onChange={(e) => setForm({ ...form, jenis: e.target.value })}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="benefit">Benefit</option>
              <option value="cost">Cost</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Batal</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriteriaEdit;