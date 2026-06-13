import { useContext } from 'react';
import { ChevronLeft, ShoppingCart, Minus, Plus, Trash2, CheckCircle } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage({ navigate }) {
  const { cart, formatRupiah, removeFromCart, updateCartQuantity, cartTotal, cartCount } = useContext(ShopContext);
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      sessionStorage.setItem('authRedirect', '/checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] py-12 animate-in fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-slate-500 hover:text-[#c4883b] mb-8 transition-colors font-medium"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali Belanja</span>
        </button>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Keranjang Belanja</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-100">
            <div className="bg-[#fcfaf8] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Keranjang Anda Kosong</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Sepertinya Anda belum menemukan barang yang dicari. Yuk telusuri koleksi produk terbaik kami!</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#d99a45] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#c4883b] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row items-center gap-6 group hover:border-[#e5b367] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-[#fcfaf8] group-hover:scale-105 transition-transform duration-500" />
                  <div className="flex-grow text-center sm:text-left w-full sm:w-auto">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h3>
                    <p className="text-[#c4883b] font-extrabold">{formatRupiah(item.price)}</p>
                  </div>
                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center bg-[#fcfaf8] border border-slate-200 rounded-lg p-1">
                      <button 
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1.5 text-slate-600 hover:bg-white hover:shadow-md active:scale-90 rounded-md transition-all duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1.5 text-slate-600 hover:bg-white hover:shadow-md active:scale-90 rounded-md transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 active:scale-90 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Ringkasan Belanja</h3>
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Barang</span>
                    <span className="font-medium text-slate-900">{cartCount} item</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-slate-900 pt-4 border-t border-slate-100">
                    <span>Total Harga</span>
                    <span className="text-[#c4883b] text-xl">{formatRupiah(cartTotal)}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#4a7c59] text-white py-4 rounded-xl font-bold hover:bg-[#d99a45] shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Checkout Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}