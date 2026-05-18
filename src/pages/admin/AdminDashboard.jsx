import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Package, Plus, Edit, Trash2, Home, LogOut, Store, DollarSign, ShoppingBag, AlertTriangle, ClipboardList, TrendingUp, Loader2, Upload, ImageIcon, Link2, Settings } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext';
import { API_URL } from '../../config/api';
import { resolveProductImageUrl } from '../../utils/imageUrl';

const MAX_IMAGE_MB = 5;

export default function AdminDashboard({ navigate, onLogout, adminToken, adminUser }) {
  const { products, setProducts, formatRupiah } = useContext(ShopContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', stock: '', description: '', category: '', image: ''
  });
  const [imageMode, setImageMode] = useState('upload');
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  useEffect(() => {
    if (formData.image) {
      setImagePreview(resolveProductImageUrl(formData.image));
    } else {
      setImagePreview('');
    }
  }, [formData.image]);

  const resetImageState = () => {
    setImageMode('upload');
    setImageUploading(false);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Gagal fetch produk:', err);
    }
  }, [adminToken, setProducts]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDashboardStats(data);
        }
      } catch (err) {
        console.error('Gagal fetch stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [adminToken]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openAddForm = () => {
    setFormData({ name: '', price: '', stock: '', description: '', category: '', image: '' });
    setEditingProduct(null);
    resetImageState();
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setFormData({ ...product });
    setEditingProduct(product);
    const isExternalUrl = product.image && /^https?:\/\//i.test(product.image);
    setImageMode(isExternalUrl ? 'url' : product.image ? 'upload' : 'upload');
    setImagePreview(product.image ? resolveProductImageUrl(product.image) : '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsFormOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Pilih file gambar (JPG, PNG, WEBP, atau GIF).');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      alert(`Ukuran gambar maksimal ${MAX_IMAGE_MB} MB.`);
      e.target.value = '';
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setImageUploading(true);

    try {
      const body = new FormData();
      body.append('image', file);

      const res = await fetch(`${API_URL}/api/admin/upload/product-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || `Upload gagal (${res.status})`);
      }

      setFormData((prev) => ({ ...prev, image: data.url }));
      setImagePreview(resolveProductImageUrl(data.url));
    } catch (err) {
      console.error('Upload gambar gagal:', err);
      alert(`❌ ${err.message}`);
      setImagePreview(formData.image ? resolveProductImageUrl(formData.image) : '');
    } finally {
      setImageUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen?')) {
      try {
        const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server error ${res.status}`);
        }
        await fetchProducts();
      } catch (err) {
        alert(`❌ Gagal menghapus produk: ${err.message}`);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image?.trim()) {
      alert('Unggah gambar dari perangkat atau isi URL gambar produk.');
      return;
    }

    if (imageUploading) {
      alert('Tunggu hingga upload gambar selesai.');
      return;
    }

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description,
      category: formData.category,
      image: formData.image.trim()
    };

    if (!Number.isFinite(productData.price) || productData.price < 0) {
      alert('Harga produk tidak valid.');
      return;
    }
    if (!Number.isFinite(productData.stock) || productData.stock < 0) {
      alert('Stok produk tidak valid.');
      return;
    }

    try {
      if (editingProduct) {
        const res = await fetch(`${API_URL}/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(productData)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const detail = errData.details?.map((d) => d.message).join(', ');
          throw new Error(detail || errData.error || `Server error ${res.status}`);
        }
      } else {
        const res = await fetch(`${API_URL}/api/admin/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(productData)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 401) throw new Error('Sesi habis! Silakan login ulang.');
          const detail = errData.details?.map((d) => d.message).join(', ');
          throw new Error(detail || errData.error || `Server error ${res.status}`);
        }
      }
      await fetchProducts();
      setIsFormOpen(false);
      resetImageState();
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f4f7f5] to-slate-100">
      <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="bg-gradient-to-br from-[#4a7c59] to-[#3a6347] p-2 rounded-lg sm:p-2.5 sm:rounded-xl shadow-md shadow-[#4a7c59]/20 transform hover:scale-105 transition-transform">
              <Store className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base md:text-xl font-black text-slate-900 tracking-tight block leading-tight">
                AdminPanel
              </span>
              {adminUser && (
                <span className="text-[10px] sm:text-xs text-slate-400 font-semibold hidden sm:block truncate max-w-[120px] sm:max-w-none">
                  Halo, {adminUser.username} 👋
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate('/admin/orders')}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-4 sm:py-2.5 bg-[#d99a45] text-white hover:bg-[#c4883b] hover:shadow-lg hover:shadow-[#d99a45]/20 rounded-xl transition-all text-xs sm:text-sm font-bold shadow-sm active:scale-95"
              title="Pesanan"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Pesanan</span>
              {dashboardStats?.orders?.pending_count > 0 && (
                <span className="bg-white/25 text-white text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-full ml-0.5 sm:ml-1 animate-pulse">
                  {dashboardStats.orders.pending_count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/settings')}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-4 sm:py-2.5 bg-[#4a7c59] text-white hover:bg-[#3a6347] hover:shadow-lg hover:shadow-[#4a7c59]/20 rounded-xl transition-all text-xs sm:text-sm font-bold shadow-sm active:scale-95"
              title="CMS Beranda"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">CMS Beranda</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-3 sm:py-2.5 text-slate-600 hover:text-[#4a7c59] hover:bg-[#f0f7f4] rounded-xl transition-colors text-xs sm:text-sm font-bold"
              title="Toko"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Toko</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-3 sm:py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors text-xs sm:text-sm font-bold"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Modern SaaS Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 p-6 rounded-3xl shadow-sm border border-emerald-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pendapatan</p>
            {statsLoading ? (
              <Loader2 className="h-7 w-7 animate-spin text-slate-300 mt-2" />
            ) : (
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                {formatRupiah(dashboardStats?.revenue || 0)}
              </h3>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 rounded-3xl shadow-sm border border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              {dashboardStats?.orders?.pending_count > 0 && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full animate-pulse">
                  {dashboardStats.orders.pending_count} pending
                </span>
              )}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pesanan</p>
            {statsLoading ? (
              <Loader2 className="h-7 w-7 animate-spin text-slate-300 mt-2" />
            ) : (
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                {dashboardStats?.orders?.total_orders || 0}
              </h3>
            )}
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 p-6 rounded-3xl shadow-sm border border-amber-100 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-2xl shadow-md shadow-amber-500/10 group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jenis Produk</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{totalProducts}</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/30 p-6 rounded-3xl shadow-sm border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 p-3 rounded-2xl shadow-md shadow-purple-500/10 group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6 text-white" />
              </div>
              {dashboardStats?.lowStockProducts?.length > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3 animate-bounce" />
                  <span>{dashboardStats.lowStockProducts.length} rendah</span>
                </span>
              )}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Stok</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{totalStock}</h3>
          </div>
        </div>

        {dashboardStats?.lowStockProducts?.length > 0 && (
          <div className="bg-amber-50/70 backdrop-blur-sm border border-amber-200 rounded-3xl p-4.5 mb-8 flex items-start space-x-3 shadow-sm shadow-amber-500/5">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-extrabold text-amber-900 text-sm">Peringatan Stok Rendah</p>
              <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                {dashboardStats.lowStockProducts.map((p) => `${p.name} (${p.stock})`).join(', ')} — segera lakukan restok produk agar tidak kehabisan penjualan!
              </p>
            </div>
          </div>
        )}

        {/* Premium Product Table Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inventori Produk</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Kelola data, kategori, stok, dan harga produk Anda.</p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-[#4a7c59] to-[#3a6347] hover:from-[#3a6347] hover:to-[#2d5038] text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-[#4a7c59]/20 transition-all shadow-md active:scale-95 flex-shrink-0"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Tambah Produk</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4.5">Produk</th>
                  <th className="px-6 py-4.5">Kategori</th>
                  <th className="px-6 py-4.5">Harga</th>
                  <th className="px-6 py-4.5">Stok</th>
                  <th className="px-6 py-4.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={resolveProductImageUrl(p.image)}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1504264669645-31c3bfdb687b?auto=format&fit=crop&w=100&q=60';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-800 text-sm tracking-tight">{p.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 max-w-[240px] mt-0.5">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="bg-[#f0f7f4] text-[#4a7c59] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 font-bold text-slate-700 text-sm">{formatRupiah(p.price)}</td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                          p.stock <= 5 
                            ? 'bg-red-50 text-red-600 border border-red-100' 
                            : 'bg-slate-50 text-slate-700 border border-slate-100'
                        }`}
                      >
                        {p.stock} unit
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEditForm(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors hover:shadow-sm"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors hover:shadow-sm"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-slate-400 font-semibold text-sm">
                      Belum ada produk di inventori Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/50 animate-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <div>
                <h3 className="font-black text-xl text-slate-900 tracking-tight">
                  {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Isi rincian detail produk dengan lengkap.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <div className="p-8 overflow-y-auto bg-white/30">
              <form id="productForm" onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nama Produk</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm text-slate-800 font-semibold"
                      placeholder="Contoh: Cendawan Tiram Premium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm text-slate-800 font-semibold"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Stok Tersedia</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm text-slate-800 font-semibold"
                      placeholder="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Kategori</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm text-slate-800 font-semibold"
                      placeholder="Contoh: Cendawan Segar"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Gambar Produk</label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                          imageMode === 'upload'
                            ? 'bg-[#4a7c59] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload Perangkat
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                          imageMode === 'url'
                            ? 'bg-[#4a7c59] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        URL Gambar
                      </button>
                    </div>

                    {imageMode === 'upload' ? (
                      <div className="space-y-3">
                        <label
                          className={`flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                            imageUploading
                              ? 'border-[#4a7c59]/40 bg-[#f0f7f4]/50 pointer-events-none'
                              : 'border-slate-200 bg-[#fcfaf8] hover:border-[#4a7c59]/50 hover:bg-[#f0f7f4]/30'
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={handleImageFileChange}
                            disabled={imageUploading}
                          />
                          {imageUploading ? (
                            <div className="flex flex-col items-center gap-2 py-6 text-[#4a7c59]">
                              <Loader2 className="h-8 w-8 animate-spin" />
                              <span className="text-sm font-semibold">Mengunggah gambar...</span>
                            </div>
                          ) : imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Pratinjau"
                              className="max-h-40 w-full object-contain rounded-xl p-2"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 py-8 text-slate-500">
                              <ImageIcon className="h-10 w-10 text-slate-300" />
                              <span className="text-sm font-bold text-slate-600">Klik untuk pilih gambar</span>
                              <span className="text-xs text-slate-400">JPG, PNG, WEBP, GIF — maks. {MAX_IMAGE_MB} MB</span>
                            </div>
                          )}
                        </label>
                        {formData.image && !imageUploading && (
                          <p className="text-xs text-[#4a7c59] font-bold flex items-center gap-1.5 animate-pulse">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#4a7c59]" />
                            Gambar siap disimpan ke database
                          </p>
                        )}
                      </div>
                    ) : (
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm text-slate-800 font-semibold"
                        placeholder="https://images.unsplash.com/..."
                      />
                    )}

                    {imagePreview && imageMode === 'url' && (
                      <img
                        src={imagePreview}
                        alt="Pratinjau"
                        className="mt-3 max-h-32 rounded-xl border border-slate-100 object-cover shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Deskripsi Singkat</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none resize-none transition-all text-sm text-slate-800 font-semibold"
                      placeholder="Jelaskan detail singkat tentang produk ini..."
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 flex justify-end space-x-4 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-colors text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                form="productForm"
                disabled={imageUploading}
                className="px-6 py-2.5 bg-gradient-to-r from-[#4a7c59] to-[#3a6347] hover:from-[#3a6347] hover:to-[#2d5038] text-white rounded-xl font-bold hover:shadow-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {imageUploading ? 'Menunggu upload...' : 'Simpan Produk'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}