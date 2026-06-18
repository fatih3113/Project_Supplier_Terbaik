import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Medal, Calendar } from 'lucide-react';

interface Ranking {
  id_supplier: number;
  nama_supplier: string;
  nilai: number;
  ranking: number;
}

const Ranking: React.FC = () => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Default hari ini (YYYY-MM-DD)
  );

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // Mengirim parameter tanggal ke rute backend
        const res = await api.get('/ranking', { params: { date: selectedDate } });
        setRankings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRanking();
  }, [selectedDate]);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hasil Perangkingan Supplier (Metode SAW)</h2>
          <p className="text-sm text-gray-500">Nilai preferensi dihitung otomatis berdasarkan normalisasi matriks benefit dan cost.</p>
        </div>
        
        {/* Filter Tanggal */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Calendar size={16} className="text-gray-400" />
          <label htmlFor="date-filter" className="sr-only">Pilih tanggal</label>
          <input
            id="date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-200 rounded-lg p-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold uppercase">
              <th className="p-4 text-center w-24">Ranking</th>
              <th className="p-4">Nama Supplier</th>
              <th className="p-4">Nilai Preferensi (V)</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {rankings.map((r, index) => (
              <tr key={r.id_supplier || index} className={r.ranking === 1 ? 'bg-indigo-50/40' : ''}>
                <td className="p-4 text-center">
                  {r.ranking === 1 ? (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs">
                      <Medal size={14} /> 1st Best
                    </span>
                  ) : (
                    <span className="font-bold text-gray-600">{r.ranking}</span>
                  )}
                </td>
                <td className="p-4 font-semibold text-gray-900">{r.nama_supplier}</td>
                <td className="p-4 font-bold text-indigo-600 text-base">{r.nilai}</td>
              </tr>
            ))}
            {rankings.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-8 text-gray-400">
                  Belum ada data nilai atau kriteria untuk memproses perhitungan SAW pada tanggal terpilih.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranking;