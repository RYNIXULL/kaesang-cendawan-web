import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { API_URL } from '../config/api';
import { toArray } from '../utils/array';
import { resolveProductImageUrl } from '../utils/imageUrl';

const initialProducts = [
  {
    id: 1,
    name: "Cendawan Tiram",
    price: 15000,
    stock: 50,
    description: "Cendawan tiram segar, cocok untuk digoreng krispi atau ditumis. Harga per kilogram.",
    category: "Cendawan Segar",
    image: "https://images.unsplash.com/photo-1626084478144-8848db215286?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Cendawan Kuping",
    price: 30000,
    stock: 30,
    description: "Cendawan kuping pilihan dengan tekstur kenyal. Cocok untuk sup dan tumisan. Harga per kilogram.",
    category: "Cendawan Segar",
    image: "https://images.unsplash.com/photo-1511914265872-c40672604a80?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Cendawan Merang",
    price: 25000,
    stock: 40,
    description: "Cendawan merang segar berkualitas tinggi. Cocok untuk aneka masakan tradisional. Harga per kilogram.",
    category: "Cendawan Segar",
    image: "https://images.unsplash.com/photo-1504264669645-31c3bfdb687b?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    name: "Cendawan Padi",
    price: 25000,
    stock: 25,
    description: "Cendawan padi organik segar yang baru dipanen. Nikmat dan bergizi tinggi. Harga per kilogram.",
    category: "Cendawan Segar",
    image: "https://images.unsplash.com/photo-1505820986704-58389656fb39?auto=format&fit=crop&w=500&q=60"
  }
];

// Normalisasi field dari backend agar konsisten dengan frontend
function normalizeProduct(p) {
  return {
    id: Number(p.id) || 0,
    name: p.name || p.product_name || p.nama || '',
    price: Number(p.price) || Number(p.harga) || 0,
    stock: Number(p.stock) || Number(p.stok) || 0,
    description: p.description || p.product_description || p.deskripsi || '',
    category: p.category || p.product_category || p.kategori || 'Lainnya',
    image: resolveProductImageUrl(p.image || p.image_url || p.foto || '')
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();
export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          const list = toArray(data, ['products', 'data', 'items']);
          if (list.length > 0) {
            setProducts(list.map(normalizeProduct));
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Gagal ambil data dari MySQL:', err.message);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  const formatRupiah = useCallback((number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }, []);

  const addToCart = useCallback((product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const newQuantity = item.quantity + delta;
        if (newQuantity > 0 && newQuantity <= (product?.stock || 0)) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    }));
  }, [products]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(() => ({
    products,
    setProducts,
    cart,
    setCart,
    formatRupiah,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartCount,
    loading,
    error
  }), [products, cart, formatRupiah, addToCart, removeFromCart, updateCartQuantity, cartTotal, cartCount, loading, error]);

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};