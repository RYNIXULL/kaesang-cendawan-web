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
    <nav className="bg-[#f0f7f4]/90 backdrop-blur-md text-[#2c4a35] p-4 sticky top-0 z-50 shadow-sm border-b border-[#d1e6d9]">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full px-4">
        <div className="flex items-center space-x-3 cursor-pointer group relative" onClick={onLogoClick} title="KAESANG CENDAWAN">
          <div className="relative flex items-center justify-center w-10 h-10">
            <img src={LogoKaesang} alt="Logo" className={`max-h-full max-w-full object-contain drop-shadow-sm transition-all duration-300 group-hover:scale-110 ${clickProgress > 0 ? 'animate-pulse-glow' : ''}`} onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="block" }} />
            {clickProgress > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#d99a45] rounded-full flex items-center justify-center animate-bounceIn shadow-lg">
                <span className="text-white text-[10px] font-bold">{7 - clickProgress}</span>
              </div>
            )}
          </div>
          <span className="text-xl font-extrabold tracking-wider text-[#2c4a35] group-hover:text-[#d99a45] transition-colors duration-300">KAESANG CENDAWAN</span>
        </div>
        
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button
            type="button"
            onClick={onTrackClick}
            className="hidden sm:flex items-center space-x-1 hover:text-[#e5b367] transition-colors text-sm font-medium"
          >
            <Search className="h-4 w-4" />
            <span>Cek Pesanan</span>
          </button>
          <button onClick={onCartClick} className="relative flex items-center space-x-1 hover:text-[#e5b367] transition-colors group">
            <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="hidden sm:inline font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#d99a45] text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                {cartCount}
              </span>
            )}
          </button>
          
          {isAdmin && (
            <button onClick={onAdminClick} className="flex items-center space-x-1 bg-[#d99a45] hover:bg-[#c4883b] text-white px-3 py-1.5 rounded-md transition-colors text-sm font-medium">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
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
    <section className="bg-gradient-to-r from-[#7a9d70] to-[#d99a45] text-white py-24 px-4 relative overflow-hidden w-full">
      <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Pusat Cendawan <span className="text-[#fef3c7]">Segar</span> Berkualitas
        </h1>
        <p className="text-base md:text-lg text-[#f0f7f4] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Menyediakan berbagai jenis cendawan pilihan langsung dari petani dengan budidaya alami dan ramah lingkungan.
        </p>
        <div className="flex justify-center">
          <button onClick={handleExplore} className="px-8 py-4 bg-white text-[#4a7c59] font-bold rounded-xl hover:bg-[#fef3c7] transition-all duration-300 shadow-lg flex items-center gap-2 group active:scale-95">
            <Sparkles className="h-5 w-5" />
            Jelajahi Produk
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
      }, 20);
      return () => clearInterval(interval);
    });
  }, [started, stats]);

  return (
    <section ref={ref} className="bg-white py-16 border-y border-slate-100 w-full">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center items-center">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-4">
                <div className="bg-[#4a7c59]/10 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-[#4a7c59]" />
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-[#4a7c59] mb-1">
                  {stat.value.startsWith('+') || stat.value.startsWith('%')
                    ? `${counts[stat.label] || 0}${stat.value.slice(-1)}`
                    : counts[stat.label] || stat.value}
                </h3>
                <p className="text-slate-500 text-xs font-medium">{stat.label}</p>
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
    <section id="produk" className="bg-[#fcfaf8] py-16 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">Produk Pilihan Kami</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">Pilih dari berbagai jenis cendawan berkualitas tinggi</p>
        </div>

        <div className="mb-10 w-full max-w-4xl mx-auto">
          <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
        </div>

        {searchQuery && (
          <p className="text-xs text-slate-400 mb-4 text-center sm:text-left">
            Menampilkan <strong>{filteredProducts.length}</strong> hasil untuk "<em>{searchQuery}</em>"
          </p>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col max-w-sm mx-auto w-full">
                <div className="relative h-48 bg-slate-100 w-full">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1504264669645-31c3bfdb687b?auto=format&fit=crop&w=300&q=60'; }} />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-red-500/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-white text-red-600 font-bold px-4 py-1.5 rounded-full text-xs shadow-md">Habis</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 text-[10px] font-bold px-2 py-1 rounded-full text-slate-600 shadow-sm">
                    {product.category}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-slate-400 text-xs mb-3 line-clamp-2 flex-grow">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-[#d99a45] text-base">{formatRupiah(product.price)}</span>
                    <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded">Stok: {product.stock}</span>
                  </div>
                  <button onClick={() => { addToCart(product); addToast(`✅ ${product.name} masuk keranjang!`, 'success', 2000); }} disabled={product.stock === 0} className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-all ${product.stock === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#4a7c59] text-white hover:bg-[#d99a45]'}`}>
                    <ShoppingCart className="h-4 w-4" />
                    <span>{product.stock === 0 ? 'Habis' : 'Tambah'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Flower className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Produk tidak ditemukan</p>
          </div>
        )}
      </div>
    </section>
  );
};

const LocationSection = () => {
  return (
    <section className="bg-white py-16 px-4 border-t border-slate-50 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="w-full">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-[#4a7c59]" /> Kunjungi Toko Kami
            </h2>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Selain berbelanja online, datang langsung ke toko dan kebun jamur kami untuk melihat proses budidaya dan memilih jamur segar.
            </p>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
              <p className="font-bold text-slate-700 text-xs mb-1 flex items-center gap-1"><Leaf className="h-4 w-4 text-[#4a7c59]" /> Alamat:</p>
              <p className="text-slate-500 text-xs">Pakuan Sakti, Kec. Pakuan Ratu, Kabupaten Way Kanan, Lampung 34762</p>
            </div>
            <div className="flex gap-3">
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-[#4a7c59] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#d99a45] transition-all">
                <MapPin className="h-4 w-4" /> Maps
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#128C7E] transition-all">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 w-full shadow-inner">
            <iframe title="Google Maps" src="https://maps.google.com/maps?q=Pakuan%20Sakti,%20Pakuan%20Ratu,%20Way%20Kanan&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
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