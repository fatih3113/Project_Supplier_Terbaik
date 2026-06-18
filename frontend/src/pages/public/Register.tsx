import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (cleanPassword.length < 8) {
      const msg = 'Password harus minimal 8 karakter!';
      setError(msg);
      toast.error(msg, { id: 'validation-pass-length' });
      return;
    }

    if (cleanPassword !== cleanConfirmPassword) {
      const msg = 'Konfirmasi password tidak cocok!';
      setError(msg);
      toast.error(msg, { id: 'validation-pass-match' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name,
        username,
        password: cleanPassword,
        passwordConfirm: cleanConfirmPassword,
        role,
      });

      toast.success('Registrasi berhasil! Silakan masuk.', {
        duration: 4000,
        icon: '🎉',
      });

      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal, silakan coba lagi.');
      toast.error(err.response?.data?.message || 'Registrasi gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header Teks */}
      <div className="mb-6">
        <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-1">Buat Akun Baru</p>
        <h1 className="text-3xl font-black text-slate-900 mb-1">Registrasi Admin</h1>
        <p className="text-slate-500 text-sm">Isi data di bawah untuk mendaftar sebagai administrator sistem.</p>
      </div>

      {/* Alert Error */}
      {error && (
        <div className="mb-4 flex items-start space-x-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl">
          <span className="text-rose-500 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-4">

        {/* Nama Lengkap */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Nama Lengkap
          </label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Username / NIM */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Username / NIM
          </label>
          <input
            type="text"
            placeholder="Contoh: 24090002"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Hak Akses / Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
          >
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Manajer">Manajer</option>
          </select>
          <p className="mt-1 text-[11px] text-slate-400">
            Role menentukan hak akses yang dimiliki pengguna dalam sistem.
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Password (Min. 8 Karakter)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 pr-12 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Konfirmasi Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Ulangi password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 pr-12 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25 mt-4"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <>
              <UserPlus size={16} />
              <span>Daftar Akun</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="px-3 text-[11px] text-slate-400 font-medium">Sudah punya akun?</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Link Login */}
      <p className="text-center text-sm text-slate-500">
        <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          Masuk sekarang
        </Link>
      </p>

      {/* Kembali Beranda */}
      <div className="mt-6 text-center">
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

export default Register;