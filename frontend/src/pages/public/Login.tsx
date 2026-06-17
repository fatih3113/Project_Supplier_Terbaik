import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Impor toast untuk notifikasi sukses login

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      setAuth(res.data.token, res.data.user);
      
      // Memicu notifikasi sukses
      toast.success(`Selamat Datang, ${res.data.user.name || username}!`, {
        duration: 3000,
        icon: '👋',
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal, periksa username & password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header teks */}
      <div className="mb-8">
        <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-2">SPK Pemilihan Supplier</p>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Selamat Datang</h1>
        <p className="text-slate-500 text-sm">Masuk untuk melanjutkan ke dashboard kamu.</p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-5 flex items-start space-x-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl">
          <span className="text-rose-500 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Username / NIM
          </label>
          <input
            type="text"
            placeholder="Contoh: 24090002"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Lupa password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 mt-2"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <>
              <LogIn size={16} />
              <span>Masuk Dashboard</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="px-4 text-xs text-slate-400 font-medium">atau</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-slate-500">
        Belum punya akun?{' '}
        <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          Daftar sekarang
        </Link>
      </p>

      {/* Back to home */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/')}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Kembali ke Beranda
        </button>
      </div>
    </>
  );
};

export default Login;