import { useState } from 'react';
import {
  ChevronLeft,
  Search,
  Package,
  Loader2,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Truck,
  CreditCard
} from 'lucide-react';
import { API_URL } from '../config/api';
import { toArray, normalizeOrderItems } from '../utils/array';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS
} from '../constants/checkout';

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(number) || 0);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Ambil satu objek pesanan dari respons API (bukan array).
 */
function extractOrder(payload) {
  if (!payload || typeof payload !== 'object') return null;
  if (payload.order && typeof payload.order === 'object' && !Array.isArray(payload.order)) {
    return payload.order;
  }
  if (!Array.isArray(payload) && payload.id != null) {
    return payload;
  }
  return null;
}

export default function TrackOrder({ navigate, initialPhone = '', initialToken = '' }) {
  const [phone, setPhone] = useState(initialPhone);
  const [orderToken, setOrderToken] = useState(initialToken);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setSearched(true);

    const trimmedPhone = phone.trim();
    const trimmedToken = orderToken.trim();

    if (!trimmedPhone || trimmedPhone.length < 8) {
      setError('Masukkan nomor telepon yang valid (min. 8 digit).');
      return;
    }
    if (!trimmedToken) {
      setError('Masukkan token pesanan Anda.');
      return;
    }

    if (!API_URL) {
      setError('VITE_API_URL belum dikonfigurasi.');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        phone: trimmedPhone,
        orderToken: trimmedToken
      });
      const res = await fetch(`${API_URL}/api/orders/track?${params.toString()}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Pesanan tidak ditemukan');
      }

      const found = extractOrder(data);
      if (!found) {
        throw new Error('Data pesanan tidak valid dari server');
      }

      setOrder(found);
    } catch (err) {
      setError(err.message || 'Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const lineItems = order
    ? normalizeOrderItems(toArray(order.items ?? order.order_items, ['items', 'order_items']))
    : [];

  const statusLabel =
    ORDER_STATUS_LABELS[order?.status] || order?.status || '-';
  const paymentLabel =
    PAYMENT_STATUS_LABELS[order?.payment_status] || order?.payment_status || '-';
  const methodLabel =
    PAYMENT_METHOD_LABELS[order?.payment_method] || order?.payment_method || '-';

  return (
    <div className="min-h-screen bg-[#fcfaf8] flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Kembali"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">Cek Pesanan Saya</h1>
            <p className="text-xs text-slate-500">Masukkan nomor HP dan token pesanan</p>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-lg mx-auto w-full px-4 py-6 space-y-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div>
            <label htmlFor="track-phone" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nomor Telepon
            </label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="track-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/30 focus:border-[#4a7c59]"
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label htmlFor="track-token" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Token Pesanan
            </label>
            <div className="relative mt-1.5">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="track-token"
                type="text"
                value={orderToken}
                onChange={(e) => setOrderToken(e.target.value)}
                placeholder="ORD-..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/30 focus:border-[#4a7c59]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#4a7c59] hover:bg-[#3a6347] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mencari...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Lacak Pesanan
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {searched && !loading && !error && !order && (
          <p className="text-center text-sm text-slate-500">Pesanan tidak ditemukan.</p>
        )}

        {order && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">No. Pesanan</p>
                  <p className="text-xl font-extrabold text-[#4a7c59]">#{order.id}</p>
                </div>
                <p className="text-right text-xs text-slate-400">{formatDate(order.created_at)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                  <p className="font-bold text-slate-800 mt-0.5">{statusLabel}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Pembayaran</p>
                  <p className="font-bold text-slate-800 mt-0.5">{paymentLabel}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
                <CreditCard className="h-4 w-4 text-[#4a7c59]" />
                <span>{methodLabel}</span>
                {order.courier && (
                  <>
                    <span className="text-slate-300">·</span>
                    <Truck className="h-4 w-4 text-[#4a7c59]" />
                    <span>{order.courier}</span>
                  </>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="font-medium text-slate-700">{order.recipient_name || '-'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-slate-600">{order.phone || '-'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-slate-600">
                    {[order.address, order.city].filter(Boolean).join(', ') || '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 mb-3">Item Pesanan</h2>
              {lineItems.length === 0 ? (
                <p className="text-sm text-slate-500">Tidak ada item.</p>
              ) : (
                <ul className="space-y-3">
                  {lineItems.map((item) => (
                    <li
                      key={item.id || item.product_id}
                      className="flex gap-3 items-center border-b border-slate-50 last:border-0 pb-3 last:pb-0"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.quantity} × {formatRupiah(item.price)}
                        </p>
                      </div>
                      <p className="font-bold text-sm text-[#4a7c59] shrink-0">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Total</span>
                <span className="text-lg font-extrabold text-[#4a7c59]">
                  {formatRupiah(order.grand_total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
