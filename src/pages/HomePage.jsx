import { useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ShoppingCart, Package, MapPin, MessageCircle, Star, TrendingUp, Award, Users, ArrowRight, Sparkles, Flower, Leaf, Search, ShoppingBag, Mail } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { useToast } from '../components/Toast';
import BackToTop from '../components/BackToTop';
import SearchFilter from '../components/SearchFilter';
import LogoKaesang from "../assets/KAESANG CENDAWAN.png";
import About from '../components/About';
import Gallery from '../components/Gallery';
import Recipe from '../components/Recipe';
import { API_URL } from '../config/api';

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

const Navbar = ({ onCartClick, onTrackClick, onAdminClick, cartCount, isAdmin, onLogoClick, clickProgress }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-xl text-slate-800 py-3.5 px-4 sticky top-0 z-50 shadow-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full px-4">
        <div className="flex items-center space-x-3 cursor-pointer group relative" onClick={onLogoClick} title="KAESANG CENDAWAN">
          <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-[#4a7c59]/5 to-emerald-50 rounded-xl p-1 border border-emerald-100 group-hover:border-[#4a7c59]/30 transition-all duration-300">
            <img src={LogoKaesang} alt="Logo" className={`max-h-full max-w-full object-contain drop-shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${clickProgress > 0 ? 'animate-pulse' : ''}`} onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="block" }} />
            {clickProgress > 0 && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#d99a45] rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-white">
                <span className="text-white text-[9px] font-black">{7 - clickProgress}</span>
              </div>
            )}
          </div>
          <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-[#4a7c59] transition-colors duration-300 flex flex-col leading-tight">
            <span>KAESANG</span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Cendawan</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            onClick={onTrackClick}
            className="flex items-center space-x-1.5 px-3 py-2 text-slate-600 hover:text-[#4a7c59] hover:bg-[#f0f7f4] rounded-xl transition-all text-xs sm:text-sm font-bold active:scale-95"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Cek Pesanan</span>
          </button>
          
          <button 
            onClick={onCartClick} 
            className="relative flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-50 to-teal-50/50 hover:from-[#f0f7f4] hover:to-[#e1f0e8] text-[#4a7c59] rounded-xl transition-all border border-emerald-100 hover:border-[#4a7c59]/30 active:scale-95 group font-bold text-xs sm:text-sm"
          >
            <ShoppingCart className="h-4.5 w-4.5 group-hover:scale-110 transition-transform duration-300" />
            <span>Keranjang</span>
            {cartCount > 0 && (
              <span className="bg-[#d99a45] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md shadow-[#d99a45]/30 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          
          {isAdmin && (
            <button 
              onClick={onAdminClick} 
              className="flex items-center space-x-1.5 bg-[#4a7c59] hover:bg-[#3a6347] text-white px-3.5 py-2 rounded-xl transition-all text-xs sm:text-sm font-bold shadow-md shadow-[#4a7c59]/10 active:scale-95"
            >
              <Package className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ socialLinks }) => {
  const defaultSocial = {
    instagram: 'https://instagram.com/kaesangcendawan',
    facebook: 'https://facebook.com/kaesangcendawan',
    shopee: 'https://shopee.co.id/kaesangcendawan',
    gmail: 'kaesangcendawan@gmail.com'
  };

  const links = socialLinks || defaultSocial;

  // Helper untuk membersihkan gmail link
  const gmailHref = links.gmail 
    ? (links.gmail.startsWith('mailto:') ? links.gmail : `mailto:${links.gmail}`) 
    : 'mailto:kaesangcendawan@gmail.com';

  return (
    <footer className="bg-[#2c4a35] text-white py-12 w-full border-t border-[#1e3324]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-6">
        
        {/* Media Sosial */}
        <div className="flex items-center justify-center gap-6">
          {links.instagram && (
            <a 
              href={links.instagram} 
              target="_blank" 
              rel="noreferrer" 
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 border border-white/5 shadow-inner"
              title="Instagram"
            >
              <InstagramIcon className="h-5 w-5 text-white" />
            </a>
          )}
          
          {links.facebook && (
            <a 
              href={links.facebook} 
              target="_blank" 
              rel="noreferrer" 
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 border border-white/5 shadow-inner"
              title="Facebook"
            >
              <FacebookIcon className="h-5 w-5 text-white" />
            </a>
          )}

          {links.shopee && (
            <a 
              href={links.shopee} 
              target="_blank" 
              rel="noreferrer" 
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 border border-white/5 shadow-inner"
              title="Shopee"
            >
              <ShoppingBag className="h-5 w-5 text-white" />
            </a>
          )}

          {links.gmail && (
            <a 
              href={gmailHref} 
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 border border-white/5 shadow-inner"
              title="Email"
            >
              <Mail className="h-5 w-5 text-white" />
            </a>
          )}
        </div>

        <div className="h-px bg-white/10 w-24"></div>

        {/* Copyright */}
        <div className="text-center text-sm text-slate-300 font-medium tracking-wide">
          <p>© 2026 Kaesang Cendawan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const HeroSection = () => {
  const handleExplore = () => {
    document.querySelector('#produk')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-tr from-[#1b3c2b] via-[#2c4e3f] to-[#407a5b] text-white py-24 md:py-32 px-4 relative overflow-hidden w-full flex items-center justify-center">
      {/* Decorative Blob Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#d99a45]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7a9d70]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
        {/* Dynamic Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#fef3c7] text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
          <Sparkles className="h-4 w-4 text-[#d99a45]" />
          <span>Budidaya Alami & 100% Organik</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1] drop-shadow-md">
          Pusat Cendawan <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-200 to-emerald-200">
            Segar & Premium
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          Menyediakan berbagai jenis jamur tiram, kuping, dan cendawan pilihan langsung dari petani dengan sistem budidaya ramah lingkungan untuk cita rasa terbaik Anda.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={handleExplore} 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#d99a45] to-[#c4883b] text-white font-black rounded-2xl hover:shadow-xl hover:shadow-[#d99a45]/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95 text-sm uppercase tracking-wider"
          >
            <span>Belanja Sekarang</span>
            <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => document.querySelector('#tentang-kami')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/25 text-white font-black rounded-2xl transition-all duration-300 border border-white/25 flex items-center justify-center gap-2 active:scale-95 text-sm uppercase tracking-wider"
          >
            <span>Tentang Kami</span>
          </button>
        </div>
      </div>
    </section>
  );
};

const StatsSection = ({ stats }) => {
  const [counts, setCounts] = useState({});
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    stats.forEach((stat) => {
      const interval = setInterval(() => {
        setCounts(prev => ({
          ...prev,
          [stat.label]: Math.min((prev[stat.label] || 0) + 1, parseInt(stat.value))
        }));
      }, 15);
      return () => clearInterval(interval);
    });
  }, [started, stats]);

  return (
    <section ref={ref} className="bg-white py-16 w-full -mt-8 relative z-20 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-center items-center">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 flex flex-col items-center hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3.5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6.5 w-6.5 text-[#4a7c59]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-1 mt-4">
                  {stat.value.startsWith('+') || stat.value.endsWith('+') || stat.value.endsWith('%')
                    ? `${counts[stat.label] || 0}${stat.value.slice(-1)}`
                    : counts[stat.label] || stat.value}
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ProductSection = ({ filteredProducts, formatRupiah, addToCart, addToast, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) => {
  return (
    <section id="produk" className="bg-[#fcfaf8] py-20 px-4 w-full border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[#4a7c59] text-xs font-black uppercase tracking-widest mb-3">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Katalog Toko</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Koleksi Cendawan Segar</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Dapatkan rasa dan kesegaran jamur premium terbaik</p>
        </div>

        <div className="mb-12 w-full max-w-4xl mx-auto">
          <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
        </div>

        {searchQuery && (
          <p className="text-xs text-slate-400 mb-6 text-center sm:text-left font-bold uppercase tracking-wider">
            🔎 Ditemukan <strong className="text-[#4a7c59] font-black">{filteredProducts.length}</strong> hasil untuk "<em>{searchQuery}</em>"
          </p>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-100/80 overflow-hidden hover:shadow-2xl hover:shadow-[#4a7c59]/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col max-w-sm mx-auto w-full group relative"
              >
                <div className="relative h-52 bg-slate-50 w-full overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1504264669645-31c3bfdb687b?auto=format&fit=crop&w=300&q=60'; }} 
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-red-950/40 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-white text-red-600 font-extrabold px-5 py-2 rounded-full text-xs shadow-lg uppercase tracking-wider border border-red-100 animate-pulse">Habis</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl text-[#4a7c59] shadow-sm border border-emerald-50">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow bg-white/50">
                  <h3 className="font-black text-slate-800 text-base mb-1 line-clamp-1 group-hover:text-[#4a7c59] transition-colors">{product.name}</h3>
                  <p className="text-slate-400 text-xs font-semibold mb-4 line-clamp-2 flex-grow leading-relaxed">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-5 pt-3 border-t border-slate-100">
                    <span className="font-black text-[#d99a45] text-lg">{formatRupiah(product.price)}</span>
                    <span className="text-[9px] bg-slate-50 border border-slate-100 text-slate-400 font-extrabold px-2.5 py-1 rounded-lg">Stok: {product.stock}</span>
                  </div>
                  
                  <button 
                    onClick={() => { addToCart(product); addToast(`✅ ${product.name} masuk keranjang!`, 'success', 2000); }} 
                    disabled={product.stock === 0} 
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 duration-200 ${product.stock === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200/50' : 'bg-gradient-to-r from-[#4a7c59] to-[#3a6347] hover:from-[#3a6347] hover:to-[#2d5038] text-white hover:shadow-lg hover:shadow-emerald-500/10'}`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{product.stock === 0 ? 'Habis Stok' : 'Tambah Ke Keranjang'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100/80 shadow-lg max-w-md mx-auto">
            <Flower className="h-12 w-12 text-[#4a7c59]/20 mx-auto mb-3 animate-spin" style={{ animationDuration: '6s' }} />
            <p className="text-slate-500 font-black text-sm uppercase tracking-wider">Produk Tidak Ditemukan</p>
            <p className="text-slate-400 text-xs mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const LocationSection = () => {
  return (
    <section className="bg-white py-20 px-4 border-t border-slate-100 w-full relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-emerald-100/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[#4a7c59] text-xs font-black uppercase tracking-widest mb-3">
              <MapPin className="h-3.5 w-3.5" />
              <span>Lokasi Kami</span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4 flex items-center gap-2">
              Kunjungi Kebun Jamur Kami
            </h2>
            <p className="text-slate-500 mb-8 text-sm sm:text-base leading-relaxed font-semibold">
              Datang dan rasakan langsung sensasi memetik jamur segar langsung dari baglog budidaya. Tim kami siap mendampingi perjalanan edukasi Anda!
            </p>
            <div className="bg-gradient-to-br from-slate-50 to-[#f0f7f4]/20 p-6 rounded-3xl border border-slate-100 mb-8">
              <p className="font-black text-slate-800 text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5"><Leaf className="h-4.5 w-4.5 text-[#4a7c59]" /> Alamat Lengkap Kebun:</p>
              <p className="text-slate-600 text-sm font-semibold leading-relaxed">Pakuan Sakti, Kec. Pakuan Ratu, Kabupaten Way Kanan, Lampung 34762</p>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 bg-[#4a7c59] text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#3a6347] hover:shadow-lg hover:shadow-emerald-500/10 transition-all active:scale-95"
              >
                <MapPin className="h-4.5 w-4.5" /> 
                <span>Petunjuk Google Maps</span>
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#128C7E] hover:shadow-lg hover:shadow-green-500/10 transition-all active:scale-95"
              >
                <MessageCircle className="h-4.5 w-4.5" /> 
                <span>Hubungi WhatsApp</span>
              </a>
            </div>
          </div>
          <div className="h-80 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl shadow-slate-200/50 w-full relative group">
            <iframe 
              title="Google Maps" 
              src="https://maps.google.com/maps?q=Pakuan%20Sakti,%20Pakuan%20Ratu,%20Way%20Kanan&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HomePage({ navigate, isAdmin }) {
  const { products, formatRupiah, addToCart, cartCount } = useContext(ShopContext);
  const addToast = useToast();
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef(null);
  const [cmsContent, setCmsContent] = useState({
    hero_image: '',
    about_text: '',
    gallery_images: [],
    social_links: null
  });

  useEffect(() => {
    const fetchCmsContent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/homepage-contents`);
        if (res.ok) {
          const data = await res.json();
          setCmsContent({
            hero_image: data.hero_image || '',
            about_text: data.about_text || '',
            gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : [],
            social_links: data.social_links || null
          });
        }
      } catch (err) {
        console.error('Gagal memuat konten homepage:', err);
      }
    };
    fetchCmsContent();
  }, []);

  const handleLogoClick = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (newCount >= 7) {
      setClickCount(0);
      addToast('🔐 Akses admin terbuka!', 'info', 2000);
      setTimeout(() => navigate('/admin/login'), 800);
      return;
    }
    timerRef.current = setTimeout(() => setClickCount(0), 3000);
  }, [clickCount, navigate, addToast]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...new Set(products.map(p => p.category).filter(cat => cat && cat !== 'Semua'))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const query = (searchQuery || '').toLowerCase().trim();
    return products.filter((product) => {
      if (!product) return false;
      const matchSearch = !query ||
        (product.name?.toLowerCase() || '').includes(query) ||
        (product.description?.toLowerCase() || '').includes(query);
      const matchCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const stats = [
    { icon: Star, value: '150+', label: 'Pelanggan Puas' },
    { icon: TrendingUp, value: '50+', label: 'Produk Terjual/Hari' },
    { icon: Award, value: '100%', label: 'Organik & Alami' },
    { icon: Users, value: '5+', label: 'Tahun Berdiri' },
  ];

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar
        onCartClick={() => navigate('/cart')}
        onTrackClick={() => navigate('/track')}
        onAdminClick={() => navigate('/admin/login')}
        cartCount={cartCount}
        isAdmin={isAdmin}
        onLogoClick={handleLogoClick}
        clickProgress={clickCount}
      />
      
      <BackToTop />
      
      <div className="w-full flex-grow flex flex-col items-center justify-start">
        <HeroSection />
        <StatsSection stats={stats} />
        
        <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-12">
          <About text={cmsContent.about_text} image={cmsContent.hero_image} />
          <Gallery items={cmsContent.gallery_images} />
          <Recipe />
        </div>

        <ProductSection filteredProducts={filteredProducts} formatRupiah={formatRupiah} addToCart={addToCart} addToast={addToast} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
        <LocationSection />
      </div>
      
      <Footer socialLinks={cmsContent.social_links} />
    </div>
  );
}