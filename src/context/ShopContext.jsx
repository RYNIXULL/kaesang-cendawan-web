import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { API_URL } from '../config/api';
import { toArray } from '../utils/array';
import { resolveProductImageUrl } from '../utils/imageUrl';
import { useAuth } from './AuthContext';
import useDebounce from '../hooks/useDebounce';

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
  const { user, session } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Tracks pending quantity updates for debounced server sync
  const [pendingUpdates, setPendingUpdates] = useState({});
  const debouncedPendingUpdates = useDebounce(pendingUpdates, 800);

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
          setProducts(list.map(normalizeProduct));
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

  // === API FETCH: GET cart from server ===
  // TODO: Replace with your actual backend endpoint
  // Example: GET ${API_URL}/api/cart (with Authorization header using session.access_token)
  // Expected response: { items: [{ product_id, quantity, ...product_data }] }
  // After fetch, call setCart(normalizedItems)
  const fetchCartServer = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      console.log('[ShopContext] fetchCartServer: would fetch cart from server');
      // Placeholder — connect to your Docker backend when ready:
      // const res = await fetch(`${API_URL}/api/cart`, {
      //   headers: { Authorization: `Bearer ${session.access_token}` }
      // });
      // const data = await res.json();
      // const items = toArray(data, ['items', 'data']).map(normalizeProduct);
      // setCart(items);
      setCart([]);
    } catch (err) {
      console.error('[ShopContext] fetchCartServer error:', err);
    }
  }, [session]);

  // Load cart from server (logged in) or localStorage (guest)
  useEffect(() => {
    if (user) {
      fetchCartServer();
    } else {
      try {
        const saved = localStorage.getItem('guest_cart');
        if (saved) setCart(JSON.parse(saved));
      } catch (err) {
        console.error('[ShopContext] Failed to load guest cart:', err);
      }
    }
  }, [user, fetchCartServer]);

  // Save cart to localStorage when user is NOT logged in (guest cart sync)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // === API UPDATE: Sync debounced quantity changes to server ===
  // TODO: Replace with your actual backend endpoint
  // Example: PATCH ${API_URL}/api/cart/items/${productId} { quantity }
  // Use session.access_token for authorization
  useEffect(() => {
    if (!user || !session?.access_token) return;
    const entries = Object.entries(debouncedPendingUpdates);
    if (entries.length === 0) return;

    // Placeholder — send each pending update to the server
    entries.forEach(([productId, quantity]) => {
      console.log(`[ShopContext] Syncing quantity for product ${productId}: ${quantity}`);
      // fetch(`${API_URL}/api/cart/items/${productId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${session.access_token}`
      //   },
      //   body: JSON.stringify({ quantity })
      // });
    });

    setPendingUpdates({});
  }, [debouncedPendingUpdates, user, session]);

  const addToCart = useCallback((product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        const newQty = existing.quantity + 1;
        if (user) setPendingUpdates(prev => ({ ...prev, [product.id]: newQty }));
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      }
      if (user) setPendingUpdates(prev => ({ ...prev, [product.id]: 1 }));
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [user]);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const newQuantity = item.quantity + delta;
        if (newQuantity > 0 && newQuantity <= (product?.stock || 0)) {
          // Queue debounced server sync when user is logged in
          if (user) setPendingUpdates(prev => ({ ...prev, [id]: newQuantity }));
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    }));
  }, [products, user]);

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
  }), [products, cart, formatRupiah, addToCart, removeFromCart, updateCartQuantity, cartTotal, cartCount, loading, error, user]);

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};