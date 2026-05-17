import { useState } from 'react';
import { LogIn, Home, Eye, EyeOff, Shield, Loader2 } from 'lucide-react';
import { API_URL } from '../../config/api';

export default function AdminLogin({ onLogin, navigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(() => {
    const saved = localStorage.getItem('adminLoginAttempts');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('adminLoginAttempts', newAttempts.toString());
        setError(data.error || 'Login gagal. Coba lagi.');
        setIsLoading(false);
        return;
      }

      // Login berhasil — kirim token dan admin info ke App.jsx
      onLogin(data.token, data.admin);

    } catch (err) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('adminLoginAttempts', newAttempts.toString());
      console.error('Login error:', err);
      setError('Tidak bisa terhubung ke server. Pastikan backend aktif.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f4] via-[#fcfaf8] to-[#fdf6ee] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a7c59' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-[#4a7c59]/10 max-w-md w-full border border-white/50">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="bg-gradient-to-br from-[#4a7c59] to-[#3a6347] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#4a7c59]/30 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Shield className="h-10 w-10 text-white -rotate-3" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#d99a45] rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">🔐</span>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">Kaesang Cendawan Management</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start space-x-3 animate-in slide-in-from-top duration-300">
            <div className="bg-red-100 rounded-full p-1 mt-0.5 flex-shrink-0">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Jumlah Percobaan Login */}
        {loginAttempts > 0 && (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl text-sm mb-4 border border-yellow-100 flex items-center justify-center space-x-2">
            <span className="text-yellow-500 font-bold">⚠️</span>
            <span>Jumlah percobaan login: <strong>{loginAttempts}</strong></span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#fcfaf8] border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-slate-800 font-medium"
                placeholder="Masukkan username"
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#fcfaf8] border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all pr-12 text-slate-800 font-medium"
                placeholder="Masukkan password"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#4a7c59] to-[#3a6347] text-white py-4 rounded-xl font-bold hover:from-[#3a6347] hover:to-[#2d5038] transition-all shadow-lg shadow-[#4a7c59]/25 hover:shadow-xl hover:shadow-[#4a7c59]/30 mt-8 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Masuk Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Store */}
        <button
          onClick={() => navigate && navigate('/')}
          className="w-full mt-6 text-slate-400 hover:text-[#4a7c59] text-sm font-semibold transition-all flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-[#f0f7f4]"
        >
          <Home className="h-4 w-4" />
          <span>Kembali ke Toko</span>
        </button>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-300 font-medium">
            🔒 Koneksi terenkripsi • JWT Auth
          </p>
        </div>
      </div>
    </div>
  );
}