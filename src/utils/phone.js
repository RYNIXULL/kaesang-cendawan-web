/** Hanya digit */
export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * Validasi nomor HP Indonesia (mulai 08… atau setelah normalisasi dari 628…).
 * Pola: 08 + kode operator 8[1-9] + 7–11 digit tambahan (total panjang umum 10–14 digit).
 */
export function isValidIdMobile(value) {
  const d = digitsOnly(value);
  if (!d) return false;
  let n = d;
  if (n.startsWith('62')) n = `0${n.slice(2)}`;
  if (!n.startsWith('0')) return false;
  return /^08[1-9]\d{7,11}$/.test(n);
}
