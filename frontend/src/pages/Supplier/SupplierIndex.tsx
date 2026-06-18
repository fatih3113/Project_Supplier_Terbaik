import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import SupplierCreate from './SupplierCreate';
import SupplierEdit from './SupplierEdit';

export interface Supplier {
  id_supplier: number;
  nama_supplier: string;
  alamat: string;
  telepon: string;
  email: string;
}

const SupplierIndex: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Supplier | null>(null);

  const fetchSuppliers = async () => {
    const res = await api.get('/suppliers');
    setSuppliers(res.data);
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Hapus supplier ini? Semua nilai terkait juga akan terhapus.')) {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setEditTarget(null);
    fetchSuppliers();
  };

  return (
    <>
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Data Master Supplier</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
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
                    <button
                      onClick={() => setEditTarget(s)}
                      className="text-amber-600 hover:text-amber-700 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id_supplier)}
                      className="text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <SupplierCreate
          onSuccess={handleSuccess}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editTarget && (
        <SupplierEdit
          supplier={editTarget}
          onSuccess={handleSuccess}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </>
  );
};

export default SupplierIndex;