import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import CriteriaCreate from './CriteriaCreate';
import CriteriaEdit from './CriteriaEdit';

export interface Criteria {
  id: number;
  nama_kriteria: string;
  bobot: number;
  jenis: string;
}

const CriteriaIndex: React.FC = () => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Criteria | null>(null);

  const fetchCriteria = async () => {
    const res = await api.get('/criteria');
    setCriteria(res.data);
  };

  useEffect(() => { fetchCriteria(); }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Hapus kriteria ini?')) {
      await api.delete(`/criteria/${id}`);
      fetchCriteria();
    }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setEditTarget(null);
    fetchCriteria();
  };

  return (
    <>
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Kriteria Pembobotan SPK</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
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
                  <button
                    onClick={() => setEditTarget(c)}
                    className="text-amber-600 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-rose-600 font-semibold"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CriteriaCreate
          onSuccess={handleSuccess}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editTarget && (
        <CriteriaEdit
          criteria={editTarget}
          onSuccess={handleSuccess}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </>
  );
};

export default CriteriaIndex;