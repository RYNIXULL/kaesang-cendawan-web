import { API_URL } from '../config/api';

/**
 * Ubah path relatif upload (/uploads/...) menjadi URL penuh ke backend.
 * URL eksternal (https://) tetap dipakai apa adanya.
 */
export function resolveProductImageUrl(image) {
  const value = String(image || '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value;
  if (value.startsWith('/')) {
    return API_URL ? `${API_URL}${value}` : value;
  }
  return value;
}
