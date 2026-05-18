import { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  ChevronLeft, CheckCircle, Loader2, MapPin, Truck,
  CreditCard, ShieldCheck, Info, ChevronRight, Banknote, Copy
} from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import CourierCard from '../components/checkout/CourierCard';
import PaymentMethodCard from '../components/checkout/PaymentMethodCard';
import { API_URL } from '../config/api';
import { isValidIdMobile } from '../utils/phone';
import { toArray } from '../utils/array';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../constants/checkout';

const DEFAULT_COURIERS = [
  { id: 'Kaesang Express', name: 'Kaesang Express (Internal)', icon: '🍄', eta: '1-2 Hari', cost: 10000 },
  { id: 'JNE Regular', name: 'JNE Regular', icon: '🚚', eta: '2-3 Hari', cost: 18000 },
  { id: 'J&T Economy', name: 'J&T Economy', icon: '🚛', eta: '3-5 Hari', cost: 15000 },
  { id: 'Ambil di Toko', name: 'Ambil di Toko', icon: '🏠', eta: 'Hari yang sama', cost: 0 }
];

export default function PaymentPage({ navigate }) {
  const { cart, formatRupiah, cartTotal, setCart } = useContext(ShopContext);
  const safeCart = toArray(cart);

  const [courierOptions, setCourierOptions] = useState(DEFAULT_COURIERS);
  const [currentStep, setCurrentStep] = useState(1);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [selectedCourier, setSelectedCourier] = useState('Kaesang Express');
  const [selectedPayment, setSelectedPayment] = useState('TRANSFER_BRI');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const [shippingByCourier, setShippingByCourier] = useState({});
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState(null);

  useEffect(() => {
    const fetchCmsOptions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/homepage-contents`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.shipping_methods) && data.shipping_methods.length > 0) {
            const formatted = data.shipping_methods.map(m => ({
              id: m.id,
              name: m.name,
              icon: m.icon || '🚚',
              eta: m.eta || '2-3 Hari',
              cost: m.rates?.base !== undefined ? m.rates.base : (m.cost || 0),
              rates: m.rates
            }));
            setCourierOptions(formatted);
            const hasKaesang = formatted.some(c => c.id === 'Kaesang Express');
            if (!hasKaesang && formatted.length > 0) {
              setSelectedCourier(formatted[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic shipping methods:', err);
      }
    };
    fetchCmsOptions();
  }, []);

  useEffect(() => {
    if (safeCart.length === 0 && !orderResult) {
      navigate('/');
    }
  }, [safeCart.length, navigate, orderResult]);

  useEffect(() => {
    const ac = new AbortController();
    const addr = address.trim();
    const cty = city.trim();
    if (!addr && !cty) {
      setShippingByCourier({});
      setShippingLoading(false);
      setShippingError(null);
      return undefined;
    }

    const t = setTimeout(async () => {
      if (!API_URL) {
        setShippingError('VITE_API_URL belum di-set.');
        return;
      }
      setShippingLoading(true);
      setShippingError(null);
      try {
        const pairs = await Promise.all(
          courierOptions.map(async (c) => {
            const res = await fetch(`${API_URL}/api/shipping/calculate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address: addr, city: cty, courier: c.id }),
              signal: ac.signal
            });
            if (!res.ok) throw new Error('Gagal menghitung ongkir');
            const data = await res.json();
            return [c.id, { cost: Number(data.cost) || 0, isFree: !!data.isFree }];
          })
        );
        setShippingByCourier(Object.fromEntries(pairs));
      } catch (e) {
        if (e.name !== 'AbortError') setShippingError(e.message || 'Gagal menghitung ongkir');
      } finally {
        setShippingLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, [address, city, courierOptions]);

  const selectedQuote = shippingByCourier[selectedCourier];
  const internalCourierId = courierOptions[0]?.id || 'Kaesang Express';
  const zoneQuote = shippingByCourier[internalCourierId];
  const serviceFee = 2000;
  const shippingCost =
    selectedQuote != null
      ? (selectedQuote.isFree ? 0 : Number(selectedQuote.cost) || 0)
      : 0;
  const discount = selectedQuote?.isFree ? 0 : 5000;
  const grandTotal = cartTotal + shippingCost + serviceFee - discount;
  const codEligible = !!zoneQuote?.isFree;

  const visiblePaymentMethods = PAYMENT_METHODS.filter(
    (m) => m.id !== 'COD' || codEligible
  );

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!recipientName.trim() || !address.trim() || !phone.trim()) {
        Swal.fire({ title: 'Data Belum Lengkap', text: 'Mohon isi semua data pengiriman.', icon: 'warning' });
        return;
      }
      if (!isValidIdMobile(phone)) {
        Swal.fire({
          title: 'Nomor HP tidak valid',
          text: 'Gunakan format Indonesia (contoh: 0812xxxxxxxx).',
          icon: 'warning'
        });
        return;
      }
    }
    if (currentStep === 2 && selectedPayment === 'COD' && !codEligible) {
      Swal.fire({ title: 'COD tidak tersedia', text: 'Pilih Transfer Bank BRI untuk alamat ini.', icon: 'warning' });
      return;
    }
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmitOrder = async () => {
    if (!API_URL) {
      Swal.fire({ title: 'Konfigurasi', text: 'VITE_API_URL belum di-set.', icon: 'error' });
      return;
    }
    if (!isValidIdMobile(phone)) {
      Swal.fire({ title: 'Nomor HP tidak valid', text: 'Periksa kembali nomor HP Anda.', icon: 'warning' });
      return;
    }
    if (shippingError) {
      Swal.fire({ title: 'Ongkir', text: 'Tunggu perhitungan ongkir selesai.', icon: 'warning' });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        notes: notes.trim(),
        items: safeCart.map((item) => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        courier: selectedCourier,
        paymentMethod: selectedPayment
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Gagal membuat pesanan');
      }

      setOrderResult(data);
      setCart([]);
      setCurrentStep(4);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'Gagal', text: err.message || 'Terjadi kesalahan', icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    Swal.fire({ toast: true, position: 'top', icon: 'success', title: 'Disalin', showConfirmButton: false, timer: 1500 });
  };

  if (safeCart.length === 0 && !orderResult) return null;

  const paymentLabel =
    PAYMENT_METHOD_LABELS[orderResult?.paymentMethod] ||
    orderResult?.paymentMethodLabel ||
    PAYMENT_METHOD_LABELS[selectedPayment];

  return (
    <div className="min-h-screen bg-slate-50 pb-36">
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (orderResult) navigate('/');
              else if (currentStep > 1) setCurrentStep(currentStep - 1);
              else navigate('/cart');
            }}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-slate-800">Checkout</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {orderResult ? 'Selesai' : `Langkah ${Math.min(currentStep, 3)} dari 3`}
            </p>
          </div>
          <div className="w-10" />
        </div>
        {!orderResult && (
          <div className="max-w-lg mx-auto mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4a7c59] transition-all duration-500"
              style={{ width: `${(Math.min(currentStep, 3) / 3) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {orderResult ? (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-3">
              <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto" />
              <h2 className="text-xl font-bold text-slate-800">Pesanan Berhasil Dibuat</h2>
              <p className="text-sm text-slate-500">
                No. Pesanan <span className="font-bold text-[#4a7c59]">#{orderResult.orderId}</span>
              </p>
              <p className="text-xs text-slate-400">
                Status: {orderResult.orderStatus} · Pembayaran: {orderResult.paymentStatus}
              </p>
              {orderResult.paymentToken && (
                <div className="bg-[#f0f7f4] rounded-xl p-3 text-left text-xs space-y-1">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">Token Lacak Pesanan</p>
                  <p className="font-mono font-bold text-[#4a7c59] break-all">{orderResult.paymentToken}</p>
                  <p className="text-slate-400">Simpan token ini untuk mengecek status pesanan kapan saja.</p>
                </div>
              )}
            </div>

            {orderResult.paymentMethod === 'TRANSFER_BRI' && orderResult.paymentInstructions && (
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-blue-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Instruksi Transfer Bank {orderResult.paymentInstructions.bank}
                </h3>
                <div className="bg-white rounded-2xl p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank</span>
                    <span className="font-bold">{orderResult.paymentInstructions.bank}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500">No. Rekening</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{orderResult.paymentInstructions.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(orderResult.paymentInstructions.accountNumber)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Atas Nama</span>
                    <span className="font-bold">{orderResult.paymentInstructions.accountHolder}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3">
                    <span className="text-slate-500">Jumlah Transfer</span>
                    <span className="font-black text-[#4a7c59]">
                      {formatRupiah(orderResult.paymentInstructions.amount || orderResult.grandTotal)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  {orderResult.paymentInstructions.note}. Setelah transfer, admin akan memverifikasi pembayaran
                  secara manual. Status <b>tidak</b> berubah otomatis menjadi lunas.
                </p>
              </div>
            )}

            {orderResult.paymentMethod === 'COD' && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex gap-3">
                <Banknote className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800 text-sm">COD — Bayar di Tempat</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Pesanan menunggu konfirmasi toko. Siapkan pembayaran tunai saat barang tiba.
                    Konfirmasi pembayaran hanya dilakukan admin setelah barang diterima.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {orderResult.paymentToken && (
                <button
                  type="button"
                  onClick={() => navigate('/track')}
                  className="w-full border-2 border-[#4a7c59] text-[#4a7c59] py-4 rounded-2xl font-bold hover:bg-[#f0f7f4] transition-colors"
                >
                  Cek Status Pesanan
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full bg-[#4a7c59] text-white py-4 rounded-2xl font-bold"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 text-[#4a7c59]">
                  <MapPin className="h-5 w-5" />
                  <h2 className="font-bold">Informasi Pengiriman</h2>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">NAMA PENERIMA</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/10 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">NOMOR HP</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/10 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">KECAMATAN / KOTA</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Contoh: Way Kanan"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/10 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">ALAMAT LENGKAP</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Nama jalan, Nomor rumah, RT/RW"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/10 outline-none resize-none"
                    />
                  </div>
                  {!shippingLoading && zoneQuote?.isFree && (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <p className="text-xs text-emerald-700">
                        Zona gratis ongkir — opsi <b>COD</b> tersedia.
                      </p>
                    </div>
                  )}
                  {shippingError && (
                    <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-2xl">{shippingError}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#4a7c59]">
                    <Truck className="h-5 w-5" />
                    <h2 className="font-bold">Pilih Metode Pengiriman</h2>
                  </div>
                  <div className="grid gap-3">
                    {courierOptions.map((courier) => (
                      <CourierCard
                        key={courier.id}
                        courier={courier}
                        selected={selectedCourier}
                        onSelect={setSelectedCourier}
                        quote={shippingByCourier[courier.id]}
                        shippingLoading={shippingLoading}
                        formatRupiah={formatRupiah}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#4a7c59]">
                    <CreditCard className="h-5 w-5" />
                    <h2 className="font-bold">Metode Pembayaran</h2>
                  </div>
                  <div className="grid gap-3">
                    {visiblePaymentMethods.map((method) => (
                      <PaymentMethodCard
                        key={method.id}
                        method={method}
                        selected={selectedPayment}
                        onSelect={setSelectedPayment}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 text-[#4a7c59]">
                  <ShieldCheck className="h-5 w-5" />
                  <h2 className="font-bold">Konfirmasi Pesanan</h2>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produk</p>
                    {safeCart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-xl" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-400">
                            {item.quantity}x {formatRupiah(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <hr className="border-slate-50" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Kurir</p>
                      <p className="font-bold text-slate-700">{selectedCourier}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Pembayaran</p>
                      <p className="font-bold text-slate-700">{paymentLabel}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="font-bold">{formatRupiah(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ongkir</span>
                      <span className="font-bold">
                        {selectedQuote?.isFree ? 'Gratis' : formatRupiah(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between font-black text-[#4a7c59] text-base pt-2 border-t">
                      <span>Total</span>
                      <span>{formatRupiah(grandTotal)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#f0f7f4] rounded-2xl border border-[#d1e6d9] flex gap-3">
                  <Info className="h-5 w-5 text-[#4a7c59] shrink-0" />
                  <p className="text-xs text-[#2c4a35]">
                    Pembayaran diverifikasi manual oleh admin. Status tidak berubah otomatis menjadi lunas.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!orderResult && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 p-4">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Pembayaran</p>
                <p className="text-2xl font-black text-[#4a7c59]">{formatRupiah(grandTotal)}</p>
              </div>
            </div>
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-[#4a7c59] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Lanjutkan
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 ${
                  isSubmitting ? 'bg-slate-100 text-slate-400' : 'bg-[#d99a45] text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Buat Pesanan
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
