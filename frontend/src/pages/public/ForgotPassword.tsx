import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Instruksi reset password telah dikirim ke email Anda.');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Gagal memproses permintaan reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

          <div className="px-8 py-8">

            {/* Icon & Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                <Mail size={26} className="text-indigo-600" />
              </div>
              <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-1">
                Lupa Password
              </p>
              <h1 className="text-2xl font-black text-slate-900 mb-2">Reset Password</h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Masukkan alamat Gmail yang terdaftar. Kami akan mengirim instruksi reset password ke email tersebut.
              </p>
            </div>

            {/* Success state */}
            {message ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={26} className="text-emerald-500" />
                </div>
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-4 rounded-xl w-full text-left">
                  <p className="font-semibold mb-0.5">Email terkirim!</p>
                  <p className="text-emerald-600 text-xs">{message}</p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25"
                >
                  Kembali ke Login
                </button>
              </div>
            ) : (
              <>
                {/* Error alert */}
                {error && (
                  <div className="mb-5 flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl">
                    <span className="text-rose-500 mt-0.5">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleReset} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
                    >
                      Alamat Gmail
                    </label>
                    <div className="relative">
                      <Mail
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="email"
                        type="email"
                        placeholder="contoh@gmail.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Gunakan Gmail yang didaftarkan saat registrasi akun.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <>
                        <Mail size={15} />
                        <span>Kirim Instruksi Reset</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Back to login */}
            {!message && (
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors"
                >
                  <ArrowLeft size={13} />
                  Kembali ke halaman login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;