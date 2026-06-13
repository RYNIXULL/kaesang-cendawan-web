import { useState, useEffect } from 'react';
import { ChevronLeft, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

// Custom SVG for Google icon matching Lucide style size and formatting
const GoogleIcon = ({ size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function UserLoginPage({ navigate }) {
  const { user, loginWithGoogle, loading: authLoading } = useAuth();
  const addToast = useToast();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle post-login redirection if user is already logged in on mount
  useEffect(() => {
    if (user && !authLoading) {
      const redirectPath = sessionStorage.getItem('authRedirect');
      if (redirectPath) {
        sessionStorage.removeItem('authRedirect');
        navigate(redirectPath);
      } else {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { error: googleError } = await loginWithGoogle();
      if (googleError) {
        setError(googleError.message || 'Login dengan Google gagal.');
      } else {
        addToast('Mengarahkan ke Google Sign-In...', 'info');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memproses login Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#edf8f1] via-[#dcf2e4] to-[#fbf8ee] px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] sm:w-[45vw] sm:h-[45vw] bg-emerald-300/30 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[55vw] h-[55vw] sm:w-[40vw] sm:h-[40vw] bg-amber-200/25 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* Main Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-slate-800/50 shadow-2xl shadow-slate-900/20 rounded-3xl p-8 sm:p-10 hover:shadow-emerald-900/5 transition-all duration-300">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-300 flex items-center justify-center"
          title="Kembali ke Beranda"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center mt-6 mb-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/50 dark:border-slate-700/50 shadow-sm mb-4 transition-transform duration-300 hover:scale-105">
            <LogIn size={28} className="text-[#4a7c59] dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight text-center">
            Masuk Pelanggan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-3 px-2 leading-relaxed">
            Masuk atau daftar menggunakan akun Google untuk kemudahan checkout belanja dan pelacakan pesanan Anda secara instan.
          </p>
        </div>

        {error && (
          <div className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 rounded-2xl px-4 py-3 mb-6 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || authLoading}
          className="w-full flex items-center justify-center gap-3 py-4 bg-white/60 dark:bg-slate-800/40 hover:bg-white/90 dark:hover:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 font-extrabold rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin text-[#4a7c59]" />
          ) : (
            <GoogleIcon size={20} />
          )}
          <span className="text-xs uppercase tracking-wider">Masuk dengan Google</span>
        </button>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-8 leading-relaxed">
          Dengan masuk, Anda menyetujui ketentuan layanan dan kebijakan privasi toko kami.
        </p>

      </div>
    </div>
  );
}
