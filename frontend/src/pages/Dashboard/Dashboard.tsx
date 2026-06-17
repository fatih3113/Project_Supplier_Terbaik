import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { Users, Sliders, ClipboardCheck, Trophy } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ suppliers: 0, criteria: 0, assessments: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [s, c, a] = await Promise.all([
          api.get('/suppliers'),
          api.get('/criteria'),
          api.get('/assessment'),
        ]);
        setStats({ suppliers: s.data.length, criteria: c.data.length, assessments: a.data.length });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Supplier', count: stats.suppliers, icon: <Users size={28} />, color: 'bg-blue-500' },
    { title: 'Kriteria Penilaian', count: stats.criteria, icon: <Sliders size={28} />, color: 'bg-purple-500' },
    { title: 'Data Penilaian', count: stats.assessments, icon: <ClipboardCheck size={28} />, color: 'bg-amber-500' },
    { title: 'Metode Perhitungan', count: 'SAW', icon: <Trophy size={28} />, color: 'bg-emerald-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang di Dashboard SPK</h1>
      <p className="text-gray-500 mb-8">Sistem Informasi Pengambilan Keputusan Pemilihan Supplier Terbaik.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{card.count}</p>
            </div>
            <div className={`p-3 rounded-lg text-white ${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;