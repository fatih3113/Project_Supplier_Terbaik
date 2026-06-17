import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { username });
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses pengaduan sandi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 bg-rose-50 border-l-4 border-rose-500 p-3 text-sm text-rose-700">{error}</div>}
          {message && <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 p-3 text-sm text-emerald-700">{message}</div>}
          <form className="space-y-6" onSubmit={handleReset}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Masukkan Username Anda</label>
              <input type="text" placeholder="Contoh: 24090002" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Minta Akses Reset</button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-indigo-600">Kembali ke Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;