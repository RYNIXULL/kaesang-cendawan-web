import { Building2, Banknote } from 'lucide-react';

export const PAYMENT_METHODS = [
  {
    id: 'TRANSFER_BRI',
    name: 'Transfer Bank BRI',
    icon: <Building2 className="h-5 w-5" />,
    description: 'Transfer manual — konfirmasi oleh admin'
  },
  {
    id: 'COD',
    name: 'COD (Bayar di Tempat)',
    icon: <Banknote className="h-5 w-5" />,
    description: 'Bayar saat barang sampai (zona promo)',
    badge: 'Wilayah promo',
    badgeColor: 'bg-emerald-100 text-emerald-600'
  }
];

export const PAYMENT_METHOD_LABELS = {
  TRANSFER_BRI: 'Transfer Bank BRI',
  COD: 'COD (Bayar di Tempat)'
};

export const ORDER_STATUS_LABELS = {
  PENDING_CONFIRMATION: 'Menunggu Konfirmasi',
  AWAITING_PAYMENT: 'Menunggu Pembayaran',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan'
};

export const PAYMENT_STATUS_LABELS = {
  UNPAID: 'Belum Bayar',
  PENDING_VERIFICATION: 'Menunggu Verifikasi',
  PAID: 'Lunas',
  FAILED: 'Gagal'
};

export const ORDER_STATUS_FLOW = {
  PENDING_CONFIRMATION: 'PROCESSING',
  AWAITING_PAYMENT: 'PROCESSING',
  PROCESSING: 'SHIPPED',
  SHIPPED: 'COMPLETED',
  COMPLETED: null,
  CANCELLED: null
};
