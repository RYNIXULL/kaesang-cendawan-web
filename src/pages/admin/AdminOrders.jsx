import { useState, useEffect, useCallback } from 'react';
import { 
  ClipboardList, Home, LogOut, Store, ChevronLeft, Package, 
  Truck, CheckCircle2, Clock, Filter, RefreshCw, Eye, 
  DollarSign, TrendingUp, MapPin, Phone, User, FileText, 
  ChevronDown, Loader2, Search, XCircle, Settings, Users
} from 'lucide-react';

import { API_URL } from '../../config/api';
import { toArray, normalizeOrderItems } from '../../utils/array';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  ORDER_STATUS_FLOW
} from '../../constants/checkout';

const STATUS_CONFIG = {
  PENDING_CONFIRMATION: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
    label: ORDER_STATUS_LABELS.PENDING_CONFIRMATION,
    bgGlow: 'hover:shadow-amber-100'
  },
  AWAITING_PAYMENT: {
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: Clock,
    label: ORDER_STATUS_LABELS.AWAITING_PAYMENT,
    bgGlow: 'hover:shadow-orange-100'
  },
  PROCESSING: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Package,
    label: ORDER_STATUS_LABELS.PROCESSING,
    bgGlow: 'hover:shadow-blue-100'
  },
  SHIPPED: {
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: Truck,
    label: ORDER_STATUS_LABELS.SHIPPED,
    bgGlow: 'hover:shadow-indigo-100'
  },
  COMPLETED: {
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
    label: ORDER_STATUS_LABELS.COMPLETED,
    bgGlow: 'hover:shadow-emerald-100'
  },
  CANCELLED: {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    label: ORDER_STATUS_LABELS.CANCELLED,
    bgGlow: 'hover:shadow-red-100'
  }
};

const DEFAULT_STATUS_CONFIG = {
  color: 'bg-slate-100 text-slate-600 border-slate-200',
  icon: Clock,
  label: 'Tidak diketahui',
  bgGlow: ''
};

const PAYMENT_STATUS_CONFIG = {
  UNPAID: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Clock, label: PAYMENT_STATUS_LABELS.UNPAID },
  PENDING_VERIFICATION: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
    label: PAYMENT_STATUS_LABELS.PENDING_VERIFICATION
  },
  PAID: { color: 'bg-emerald-100 text-emerald-600 border-emerald-200', icon: CheckCircle2, label: PAYMENT_STATUS_LABELS.PAID },
  FAILED: { color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle, label: PAYMENT_STATUS_LABELS.FAILED }
};

const DEFAULT_PAYMENT_CONFIG = PAYMENT_STATUS_CONFIG.UNPAID;

const FILTER_TABS = [
  { key: 'Semua', match: () => true },
  { key: 'Menunggu', match: (o) => ['PENDING_CONFIRMATION', 'AWAITING_PAYMENT'].includes(o.status) },
  { key: 'Proses', match: (o) => o.status === 'PROCESSING' },
  { key: 'Dikirim', match: (o) => o.status === 'SHIPPED' },
  { key: 'Selesai', match: (o) => o.status === 'COMPLETED' }
];

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function AdminOrders({ navigate, onLogout, adminToken }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmingPaymentId, setConfirmingPaymentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(toArray(data, ['orders']));
      } else if (res.status === 401) {
        navigate('/');
      }
    } catch (err) {
      console.error('Gagal fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [adminToken, navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/dashboard-stats`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Gagal fetch stats:', err);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}` 
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        fetchStats(); // Refresh stats setelah update
      }
    } catch (err) {
      console.error('Gagal update status:', err);
      alert('Gagal mengubah status pesanan!');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmPayment = async (orderId) => {
    setConfirmingPaymentId(orderId);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ paymentStatus: 'PAID' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || 'Gagal konfirmasi pembayaran');
      if (data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      } else {
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Gagal konfirmasi pembayaran');
    } finally {
      setConfirmingPaymentId(null);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchOrders();
    fetchStats();
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  const activeTab = FILTER_TABS.find((t) => t.key === filter) || FILTER_TABS[0];

  const filteredOrders = safeOrders.filter((o) => {
    const matchFilter = activeTab.match(o);
    const q = searchQuery.toLowerCase();
    const matchSearch =
      searchQuery === '' ||
      o.recipient_name?.toLowerCase().includes(q) ||
      o.id?.toString().includes(searchQuery) ||
      o.phone?.includes(searchQuery);
    return matchFilter && matchSearch;
  });

  const awaitingCount = safeOrders.filter((o) =>
    ['PENDING_CONFIRMATION', 'AWAITING_PAYMENT'].includes(o.status)
  ).length;
  const processingCount = safeOrders.filter((o) => o.status === 'PROCESSING').length;
  const shippingCount = safeOrders.filter((o) => o.status === 'SHIPPED').length;
  const completedCount = safeOrders.filter((o) => o.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f4f7f5] to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 text-slate-400 hover:text-[#4a7c59] hover:bg-[#f0f7f4] rounded-xl transition-all flex-shrink-0 active:scale-95"
              title="Kembali"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="bg-gradient-to-br from-[#d99a45] to-[#c4883b] p-2 rounded-lg sm:p-2.5 sm:rounded-xl shadow-md shadow-[#d99a45]/20 flex-shrink-0 transform hover:scale-105 transition-transform">
              <ClipboardList className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base md:text-xl font-black text-slate-900 tracking-tight block leading-tight truncate">
                Pesanan Masuk
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-semibold hidden sm:block">
                {safeOrders.length} total pesanan tercatat
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <button 
              onClick={handleRefresh}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-3 sm:py-2.5 text-slate-600 hover:text-[#4a7c59] hover:bg-[#f0f7f4] rounded-xl transition-colors text-xs sm:text-sm font-bold active:scale-95"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-4 sm:py-2.5 bg-[#4a7c59] text-white hover:bg-[#3a6347] hover:shadow-lg hover:shadow-[#4a7c59]/20 rounded-xl transition-all text-xs sm:text-sm font-bold shadow-sm active:scale-95"
              title="CMS Beranda"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">CMS Beranda</span>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-4 sm:py-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all text-xs sm:text-sm font-bold active:scale-95"
              title="Pelanggan"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Pelanggan</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-3 sm:py-2.5 text-slate-600 hover:text-[#4a7c59] hover:bg-[#f0f7f4] rounded-xl transition-colors text-xs sm:text-sm font-bold active:scale-95"
              title="Toko"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Toko</span>
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-3 sm:py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors text-xs sm:text-sm font-bold active:scale-95"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 p-5 rounded-3xl shadow-sm border border-emerald-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendapatan</p>
                <p className="text-base sm:text-lg font-black text-slate-800 leading-tight mt-0.5">
                  {stats ? formatRupiah(stats.revenue) : '...'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 p-5 rounded-3xl shadow-sm border border-amber-100 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-2xl shadow-md shadow-amber-500/10 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menunggu</p>
                <p className="text-xl sm:text-2xl font-black text-amber-700 leading-tight mt-0.5">{awaitingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-5 rounded-3xl shadow-sm border border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dikirim</p>
                <p className="text-xl sm:text-2xl font-black text-blue-700 leading-tight mt-0.5">{shippingCount}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{processingCount} diproses</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/30 p-5 rounded-3xl shadow-sm border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 p-2.5 rounded-2xl shadow-md shadow-purple-500/10 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selesai</p>
                <p className="text-xl sm:text-2xl font-black text-purple-700 leading-tight mt-0.5">{completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs + Search */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-100 mb-6 overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center space-x-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {FILTER_TABS.map((tab) => {
                const count = safeOrders.filter(tab.match).length;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
                      filter === tab.key
                        ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.key}
                    <span
                      className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                        filter === tab.key ? 'bg-[#4a7c59] text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama/ID/HP..."
                className="w-full pl-10 pr-8 py-2.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#4a7c59] mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Memuat pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
            <div className="bg-[#f8faf9] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              {searchQuery ? 'Tidak Ditemukan' : 'Belum Ada Pesanan'}
            </h3>
            <p className="text-slate-400 text-sm">
              {searchQuery 
                ? `Tidak ada pesanan yang cocok dengan "${searchQuery}"`
                : 'Pesanan baru akan muncul di sini saat pelanggan checkout.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConf = STATUS_CONFIG[order.status] || DEFAULT_STATUS_CONFIG;
              const StatusIcon = statusConf.icon;
              const nextStatus = ORDER_STATUS_FLOW[order.status];
              const paymentConf =
                PAYMENT_STATUS_CONFIG[order.payment_status] || DEFAULT_PAYMENT_CONFIG;
              const lineItems = normalizeOrderItems(order.items);
              const canConfirmPayment =
                order.payment_status === 'PENDING_VERIFICATION' ||
                order.payment_status === 'UNPAID';
              const isExpanded = expandedOrder === order.id;
              const isUpdating = updatingId === order.id;

              return (
                <div 
                  key={order.id} 
                  className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 ${statusConf.bgGlow} hover:shadow-md`}
                >
                  {/* Order Header */}
                  <div 
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className={`p-2.5 rounded-xl border ${statusConf.color}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                          <span className="font-extrabold text-slate-900 text-lg">#{order.id}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusConf.color}`}>
                            {statusConf.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-slate-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <User className="h-3.5 w-3.5" />
                            <span className="font-medium truncate max-w-[150px]">{order.recipient_name}</span>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs">{formatDate(order.created_at)}</span>
                          <span className="text-slate-300">•</span>
                          <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border ${paymentConf.color}`}>
                            {PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method || 'COD'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-lg font-extrabold text-[#4a7c59]">
                        {formatRupiah(order.grand_total)}
                      </span>
                      
                      <div className="flex items-center space-x-2 flex-wrap justify-end gap-2">
                        {canConfirmPayment && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmPayment(order.id);
                            }}
                            disabled={confirmingPaymentId === order.id}
                            className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {confirmingPaymentId === order.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            <span>Konfirmasi Bayar</span>
                          </button>
                        )}
                        {nextStatus && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(order.id, nextStatus);
                            }}
                            disabled={isUpdating}
                            className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-[#4a7c59] to-[#3a6347] text-white text-xs font-bold rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                {nextStatus === 'SHIPPED' && <Truck className="h-3.5 w-3.5" />}
                                {nextStatus === 'COMPLETED' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                {nextStatus === 'PROCESSING' && <Package className="h-3.5 w-3.5" />}
                              </>
                            )}
                            <span>
                              {nextStatus === 'SHIPPED'
                                ? 'Kirim'
                                : nextStatus === 'COMPLETED'
                                  ? 'Selesaikan'
                                  : 'Proses'}
                            </span>
                          </button>
                        )}
                        <ChevronDown
                          className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-[#fcfcfb] p-5 animate-in slide-in-from-top duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Info Penerima</h4>
                          <div className="bg-white rounded-xl p-4 border border-slate-100 space-y-2.5">
                            <div className="flex items-center space-x-2 text-sm">
                              <User className="h-4 w-4 text-slate-400" />
                              <span className="font-bold text-slate-800">{order.recipient_name}</span>
                            </div>
                            {order.phone && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">{order.phone}</span>
                              </div>
                            )}
                            <div className="flex items-start space-x-2 text-sm">
                              <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-600">{order.address}</span>
                            </div>
                            {order.notes && (
                              <div className="flex items-start space-x-2 text-sm">
                                <FileText className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-500 italic">{order.notes}</span>
                              </div>
                            )}
                            <div className="pt-2 border-t border-slate-50 mt-2 grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Kurir</p>
                                <p className="text-xs font-bold text-slate-700">{order.courier || 'Kaesang Express'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Pembayaran</p>
                                <p className="text-xs font-bold text-slate-700">
                                  {PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method || 'COD'}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status Pembayaran</p>
                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-bold ${paymentConf.color}`}>
                                  {order.payment_status === 'PAID' ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <Clock className="h-3 w-3" />
                                  )}
                                  {paymentConf.label}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Produk Dipesan</h4>
                          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <div className="divide-y divide-slate-50">
                              {lineItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3">
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.quantity}x {formatRupiah(item.price)}</p>
                                  </div>
                                  <span className="text-sm font-bold text-slate-700">
                                    {formatRupiah(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Price Breakdown */}
                            <div className="border-t border-slate-100 p-3 space-y-1.5 bg-[#f8faf9]">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>Subtotal</span>
                                <span>{formatRupiah(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>Ongkir</span>
                                <span>{formatRupiah(order.shipping_cost)}</span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>Biaya Layanan</span>
                                <span>{formatRupiah(order.service_fee)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-xs text-emerald-600">
                                  <span>Diskon</span>
                                  <span>-{formatRupiah(order.discount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                                <span>Grand Total</span>
                                <span className="text-[#4a7c59]">{formatRupiah(order.grand_total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Timeline */}
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status Pesanan</h4>
                        <div className="flex items-center space-x-2">
                          {['PENDING_CONFIRMATION', 'PROCESSING', 'SHIPPED', 'COMPLETED'].map((s, i, arr) => {
                            const isActive = s === order.status;
                            const isPast = arr.indexOf(order.status) >= i;
                            const conf = STATUS_CONFIG[s] || DEFAULT_STATUS_CONFIG;
                            const Icon = conf.icon;

                            return (
                              <div key={s} className="flex items-center">
                                <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                  isPast ? conf.color + ' border' : 'bg-slate-100 text-slate-400 border border-slate-200'
                                } ${isActive ? 'ring-2 ring-offset-2 ring-current scale-105' : ''}`}>
                                  <Icon className="h-3.5 w-3.5" />
                                  <span>{conf.label}</span>
                                </div>
                                {i < arr.length - 1 && (
                                  <div className={`w-6 h-0.5 mx-1 rounded-full ${
                                    arr.indexOf(order.status) > i ? 'bg-[#4a7c59]' : 'bg-slate-200'
                                  }`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
