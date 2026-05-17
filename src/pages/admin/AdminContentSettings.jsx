import { useState, useEffect, useCallback } from 'react';
import {
  Image, FileText, LayoutGrid, Plus, Trash2, Save,
  ArrowLeft, Loader2, Eye, EyeOff, RefreshCw, Store,
  Home, LogOut, ClipboardList, Settings, Upload,
  Share2, ShoppingBag, Mail
} from 'lucide-react';
import { useToast } from '../../components/Toast';
import { API_URL } from '../../config/api';
import { resolveProductImageUrl } from '../../utils/imageUrl';

const InstagramIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

// ── Komponen input teks reusable ──────────────────────────────
const FormField = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
      <Icon className="h-4 w-4 text-[#4a7c59]" />
      {label}
    </label>
    {children}
  </div>
);

// ── Kartu galeri tunggal ──────────────────────────────────────
const GalleryCard = ({ item, index, onChange, onRemove, onUpload }) => {
  const [previewError, setPreviewError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Pilih file gambar (JPG, PNG, WEBP, atau GIF).');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5 MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const resultUrl = await onUpload(file);
      onChange(index, 'image', resultUrl);
      setPreviewError(false);
    } catch (err) {
      alert(`❌ Gagal mengunggah gambar: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#f8faf9] rounded-2xl border border-slate-200 overflow-hidden group transition-all duration-200 hover:shadow-md">
      {/* Preview gambar */}
      <div className="relative h-36 bg-slate-100 overflow-hidden">
        {!previewError && item.image ? (
          <img
            src={resolveProductImageUrl(item.image)}
            alt={item.title || `Galeri ${index + 1}`}
            className="w-full h-full object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Image className="h-10 w-10" />
          </div>
        )}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
          title="Hapus item ini"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        {item.isVideo && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            VIDEO
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <input
          type="text"
          placeholder="Judul (misal: Greenhouse Jamur)"
          value={item.title || ''}
          onChange={e => onChange(index, 'title', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all"
        />
        <input
          type="text"
          placeholder="Deskripsi singkat"
          value={item.desc || ''}
          onChange={e => onChange(index, 'desc', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all"
        />
        
        {/* Input Gambar Hybrid: URL + Upload */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Tautan Gambar / URL"
            value={item.image || ''}
            onChange={e => { onChange(index, 'image', e.target.value); setPreviewError(false); }}
            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all"
          />
          <label className={`flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-600 transition-colors border border-slate-200 ${uploading ? 'pointer-events-none opacity-55' : ''}`} title="Unggah dari perangkat">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#4a7c59]" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            id={`isVideo-${index}`}
            type="checkbox"
            checked={item.isVideo || false}
            onChange={e => onChange(index, 'isVideo', e.target.checked)}
            className="w-4 h-4 accent-[#4a7c59]"
          />
          <label htmlFor={`isVideo-${index}`} className="text-xs font-medium text-slate-600 cursor-pointer">
            Item ini adalah video YouTube
          </label>
        </div>
        {item.isVideo && (
          <input
            type="url"
            placeholder="URL Embed YouTube (https://www.youtube.com/embed/...)"
            value={item.videoUrl || ''}
            onChange={e => onChange(index, 'videoUrl', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all"
          />
        )}
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function AdminContentSettings({ navigate, onLogout, adminToken, adminUser }) {
  const addToast = useToast();

  const [heroImage, setHeroImage] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroPreviewError, setHeroPreviewError] = useState(false);
  const [showHeroPreview, setShowHeroPreview] = useState(true);
  const [heroUploading, setHeroUploading] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    shopee: '',
    gmail: ''
  });

  // ── Upload helpers ───────────────────────────────────────
  const uploadImageFile = async (file) => {
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
    return data.url;
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('❌ Pilih file gambar (JPG, PNG, WEBP, atau GIF).', 'error', 3000);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('❌ Ukuran gambar maksimal 5 MB.', 'error', 3000);
      e.target.value = '';
      return;
    }

    setHeroUploading(true);
    try {
      const resultUrl = await uploadImageFile(file);
      setHeroImage(resultUrl);
      setHeroPreviewError(false);
      addToast('✅ Gambar Hero berhasil diunggah!', 'success', 2000);
    } catch (err) {
      console.error('Upload hero gagal:', err);
      addToast(`❌ Gagal mengunggah gambar: ${err.message}`, 'error', 3000);
    } finally {
      setHeroUploading(false);
    }
  };

  // ── Fetch data saat ini dari API ──────────────────────────
  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/homepage-contents`);
      if (!res.ok) throw new Error('Gagal mengambil data konten');
      const data = await res.json();
      setHeroImage(data.hero_image || '');
      setAboutText(data.about_text || '');
      setGalleryItems(Array.isArray(data.gallery_images) ? data.gallery_images : []);
      setSocialLinks(data.social_links || {
        instagram: '',
        facebook: '',
        shopee: '',
        gmail: ''
      });
    } catch (err) {
      addToast(`❌ ${err.message}`, 'error', 4000);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // ── Gallery helpers ───────────────────────────────────────
  const handleGalleryChange = (index, field, value) => {
    setGalleryItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addGalleryItem = () => {
    setGalleryItems(prev => [
      ...prev,
      { id: Date.now(), title: '', desc: '', image: '', isVideo: false, videoUrl: '' }
    ]);
  };

  const removeGalleryItem = (index) => {
    if (window.confirm('Hapus item galeri ini?')) {
      setGalleryItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  // ── Simpan perubahan ──────────────────────────────────────
  const handleSave = async () => {
    if (!heroImage.trim()) {
      addToast('⚠️ URL Hero Image tidak boleh kosong.', 'error', 3000);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/homepage-contents`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          hero_image: heroImage.trim(),
          about_text: aboutText.trim(),
          gallery_images: galleryItems,
          social_links: socialLinks
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }
      addToast('✅ Konten beranda berhasil disimpan!', 'success', 3500);
    } catch (err) {
      addToast(`❌ Gagal menyimpan: ${err.message}`, 'error', 4000);
    } finally {
      setSaving(false);
    }
  };

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8faf9]">

      {/* ── Header ── */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#4a7c59] to-[#3a6347] p-2.5 rounded-xl shadow-md shadow-[#4a7c59]/20">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block leading-tight">
                CMS Beranda
              </span>
              {adminUser && (
                <span className="text-xs text-slate-400 font-medium">Halo, {adminUser.username} 👋</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 px-3 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors text-sm font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#d99a45] text-white hover:bg-[#c4883b] rounded-xl transition-all text-sm font-bold shadow-sm"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Pesanan</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors text-sm font-bold"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Toko</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors text-sm font-bold"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* ── Page Title ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <Settings className="h-7 w-7 text-[#4a7c59]" />
              Manajemen Konten Beranda
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Perubahan akan langsung terlihat di halaman utama toko setelah disimpan.
            </p>
          </div>
          <button
            onClick={fetchContents}
            className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors text-sm font-bold"
            title="Muat ulang data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#4a7c59] mx-auto mb-3" />
              <p className="text-slate-400 font-medium">Memuat konten...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ══ SECTION 1: Hero Image ══════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-[#f0f7f4] to-white">
                <div className="bg-[#4a7c59]/10 p-2 rounded-lg">
                  <Image className="h-5 w-5 text-[#4a7c59]" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">Foto Utama (Hero Image)</h2>
                  <p className="text-xs text-slate-400">Foto di bagian About / Tentang Kami</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <FormField label="URL / Unggah Foto Hero" icon={Image}>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={heroImage}
                      onChange={e => { setHeroImage(e.target.value); setHeroPreviewError(false); }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm"
                    />
                    <label className={`flex items-center justify-center px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer text-slate-600 transition-colors border border-slate-200 ${heroUploading ? 'pointer-events-none opacity-55' : ''}`} title="Unggah dari perangkat">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleHeroImageUpload}
                        disabled={heroUploading}
                      />
                      {heroUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-[#4a7c59]" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowHeroPreview(v => !v)}
                      className="px-3 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-500 border border-slate-200"
                      title={showHeroPreview ? 'Sembunyikan preview' : 'Tampilkan preview'}
                    >
                      {showHeroPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>

                {showHeroPreview && heroImage && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 h-48 bg-slate-100">
                    {!heroPreviewError ? (
                      <img
                        src={resolveProductImageUrl(heroImage)}
                        alt="Preview Hero"
                        className="w-full h-full object-cover"
                        onError={() => setHeroPreviewError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                        <Image className="h-10 w-10" />
                        <span className="text-sm">URL gambar tidak valid atau tidak dapat dimuat</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ══ SECTION 2: About Text ══════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-[#f0f7f4] to-white">
                <div className="bg-[#4a7c59]/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-[#4a7c59]" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">Teks "Tentang Kami"</h2>
                  <p className="text-xs text-slate-400">Konten paragraf di seksi About</p>
                </div>
              </div>

              <div className="p-6">
                <FormField label='Paragraf Tentang Kami' icon={FileText}>
                  <textarea
                    rows={6}
                    value={aboutText}
                    onChange={e => setAboutText(e.target.value)}
                    placeholder="Tuliskan cerita dan deskripsi tentang usaha Anda di sini..."
                    className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none resize-none transition-all text-sm leading-relaxed"
                  />
                </FormField>
                <p className="text-xs text-slate-400 mt-2">
                  💡 Gunakan baris kosong (Enter 2x) untuk memisahkan paragraf. Teks akan ditampilkan sesuai format di atas.
                </p>
              </div>
            </div>

            {/* ══ SECTION 3: Gallery ════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#4a7c59]/10 p-2 rounded-lg">
                    <LayoutGrid className="h-5 w-5 text-[#4a7c59]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800">Galeri Budidaya</h2>
                    <p className="text-xs text-slate-400">{galleryItems.length} item terdaftar</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addGalleryItem}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4a7c59] text-white rounded-xl text-sm font-bold hover:bg-[#3a6347] transition-colors shadow-sm hover:shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Item
                </button>
              </div>

              <div className="p-6">
                {galleryItems.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <LayoutGrid className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Belum ada item galeri.</p>
                    <p className="text-sm mt-1">Klik "Tambah Item" untuk mulai menambahkan.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryItems.map((item, index) => (
                      <GalleryCard
                        key={item.id || index}
                        item={item}
                        index={index}
                        onChange={handleGalleryChange}
                        onRemove={removeGalleryItem}
                        onUpload={uploadImageFile}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ══ SECTION 4: Media Sosial ════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#f0f7f4] to-white">
                <div className="flex items-center gap-3">
                  <div className="bg-[#4a7c59]/10 p-2 rounded-lg">
                    <Share2 className="h-5 w-5 text-[#4a7c59]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800">Tautan Media Sosial & Kontak</h2>
                    <p className="text-xs text-slate-400">Tautan di bagian bawah (footer) toko</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Instagram" icon={InstagramIcon}>
                    <input
                      type="url"
                      placeholder="https://instagram.com/username"
                      value={socialLinks.instagram || ''}
                      onChange={e => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm"
                    />
                  </FormField>

                  <FormField label="Facebook" icon={FacebookIcon}>
                    <input
                      type="url"
                      placeholder="https://facebook.com/username"
                      value={socialLinks.facebook || ''}
                      onChange={e => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm"
                    />
                  </FormField>

                  <FormField label="Shopee" icon={ShoppingBag}>
                    <input
                      type="url"
                      placeholder="https://shopee.co.id/toko-anda"
                      value={socialLinks.shopee || ''}
                      onChange={e => setSocialLinks(prev => ({ ...prev, shopee: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm"
                    />
                  </FormField>

                  <FormField label="Gmail / Email" icon={Mail}>
                    <input
                      type="email"
                      placeholder="kaesangcendawan@gmail.com"
                      value={socialLinks.gmail || ''}
                      onChange={e => setSocialLinks(prev => ({ ...prev, gmail: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#fcfaf8] border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all text-sm"
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* ══ SAVE BUTTON ══════════════════════════════════ */}
            <div className="flex justify-end pt-2 pb-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#4a7c59] to-[#3a6347] text-white rounded-xl font-bold text-base hover:shadow-lg hover:shadow-[#4a7c59]/25 transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
