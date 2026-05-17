function trimTrailingSlash(url) {
  return String(url || '').replace(/\/+$/, '');
}

/**
 * Base URL API (tanpa trailing slash).
 * Produksi: wajib set VITE_API_URL. Development: fallback ke localhost jika env kosong.
 */
export const API_URL = (() => {
  const fromEnv = trimTrailingSlash(import.meta.env.VITE_API_URL);
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return 'http://localhost:5000';
  console.error('[Vite] VITE_API_URL belum di-set; build production membutuhkan variabel ini.');
  return '';
})();
