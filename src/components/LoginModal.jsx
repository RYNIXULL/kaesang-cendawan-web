/**
 * @file LoginModal.jsx
 * @description A premium glassmorphism login modal with OTP and Google OAuth flows.
 * Uses the `useAuth` hook from AuthContext for authentication methods.
 */

import { useState } from 'react';
import { ShieldCheck, Phone, Lock, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * A two-step login modal: Step 1 sends OTP to phone, Step 2 verifies it.
 * Also supports Google OAuth sign-in.
 *
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export function LoginModal({ isOpen, onClose }) {
  const { loginWithOTP, verifyOTP, loginWithGoogle, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  /** Resets all local state and closes the modal. */
  const handleClose = () => {
    setStep(1);
    setPhone('');
    setOtp('');
    setLoading(false);
    setGoogleLoading(false);
    setError('');
    onClose();
  };

  /**
   * Formats a raw numeric string into a readable phone number pattern.
   * e.g. "081234567890" → "0812-3456-7890"
   */
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 13)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setError('');
  };

  const handleOtpChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(digits);
    setError('');
  };

  /** Step 1: Send OTP to the provided phone number. */
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    const rawPhone = phone.replace(/-/g, '');
    if (rawPhone.length < 10) {
      setError('Nomor telepon tidak valid');
      return;
    }

    setLoading(true);
    try {
      const { error: otpError } = await loginWithOTP(rawPhone);
      if (otpError) {
        setError(otpError.message || 'Gagal mengirim OTP');
        return;
      }
      setStep(2);
    } catch {
      setError('Terjadi kesalahan, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  /** Step 2: Verify the OTP token. */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Kode OTP harus 6 digit');
      return;
    }

    const rawPhone = phone.replace(/-/g, '');
    setLoading(true);
    try {
      const { error: verifyError } = await verifyOTP(rawPhone, otp);
      if (verifyError) {
        setError(verifyError.message || 'Verifikasi gagal');
        return;
      }
      handleClose();
    } catch {
      setError('Terjadi kesalahan, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  /** Google OAuth sign-in. */
  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { error: googleError } = await loginWithGoogle();
      if (googleError) {
        setError(googleError.message || 'Login Google gagal');
      } else {
        onClose();
      }
    } catch {
      setError('Terjadi kesalahan, coba lagi');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        {/* Modal card */}
        <div
          className="relative w-full max-w-md mx-4 rounded-2xl backdrop-blur-2xl bg-white/30 border border-white/40 shadow-2xl shadow-slate-900/20 p-8 animate-modal-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-white/30 transition-colors"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/40 mb-3">
              <ShieldCheck size={28} className="text-emerald-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {step === 1 ? 'Masuk ke Akun' : 'Verifikasi OTP'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {step === 1
                ? 'Masukkan nomor telepon untuk menerima kode OTP'
                : `Kode telah dikirim ke ${phone}`}
            </p>
          </div>

          {/* Step 1: Phone input */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="0812-3456-7890"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/50 border border-white/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50/60 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || authLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {(loading || authLoading) ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'Kirim OTP'
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP input */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Kode OTP
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Masukkan 6 digit kode"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/50 border border-white/50 text-slate-800 placeholder:text-slate-400 tracking-[0.3em] text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50/60 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || authLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {(loading || authLoading) ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'Verifikasi'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                  setError('');
                }}
                disabled={loading || authLoading}
                className="w-full text-sm text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Ubah nomor telepon
              </button>
            </form>
          )}

          {/* Divider */}
          {step === 1 && (
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-400/40" />
              <span className="text-sm text-slate-500">Atau</span>
              <div className="flex-1 h-px bg-slate-400/40" />
            </div>
          )}

          {/* Google OAuth button */}
          {step === 1 && (
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || authLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-white/50 text-slate-700 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {(googleLoading || authLoading) ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
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
              )}
              Masuk dengan Google
            </button>
          )}
        </div>
      </div>
    </>
  );
}
