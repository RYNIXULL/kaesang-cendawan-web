import { useState, useEffect, useCallback } from 'react';
import { 
  Users, Home, LogOut, ChevronLeft, Package, Trash2, 
  RefreshCw, Loader2, Search, Settings, ClipboardList
} from 'lucide-react';
import { useToast } from '../../components/Toast';
import { API_URL } from '../../config/api';

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function AdminUsers({ navigate, onLogout, adminToken, adminUser }) {
  const addToast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else if (res.status === 401) {
        navigate('/');
      }
    } catch (err) {
      console.error('Gagal fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [adminToken, navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId, email, phone) => {
    const identifier = email || phone || userId;
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun pelanggan "${identifier}" secara permanen? Pembeli tidak akan bisa login kembali.`)) {
      setDeletingId(userId);
      try {
        const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `Server error ${res.status}`);
        }
        addToast('Akun pelanggan berhasil dihapus secara permanen.', 'success', 3000);
        fetchUsers();
      } catch (err) {
        addToast(`Gagal menghapus akun: ${err.message}`, 'error', 4000);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchEmail = (u.email || '').toLowerCase().includes(q);
    const matchPhone = (u.phone || '').includes(q);
    const matchName = (u.user_metadata?.full_name || '').toLowerCase().includes(q);
    const matchId = (u.id || '').toLowerCase().includes(q);
    return matchEmail || matchPhone || matchName || matchId;
  });

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
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-lg sm:p-2.5 sm:rounded-xl shadow-md shadow-indigo-500/20 flex-shrink-0 transform hover:scale-105 transition-transform">
              <Users className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base md:text-xl font-black text-slate-900 tracking-tight block leading-tight truncate">
                Kelola Pelanggan
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-semibold hidden sm:block">
                {users.length} akun terdaftar di sistem
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
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-4 sm:py-2.5 text-slate-600 hover:text-[#4a7c59] hover:bg-[#f0f7f4] rounded-xl transition-all text-xs sm:text-sm font-bold active:scale-95"
              title="Inventori Produk"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Produk</span>
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-4 sm:py-2.5 text-slate-600 hover:text-[#d99a45] hover:bg-[#fcfaf8] rounded-xl transition-all text-xs sm:text-sm font-bold active:scale-95"
              title="Pesanan"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Pesanan</span>
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:px-4 sm:py-2.5 text-slate-600 hover:text-[#4a7c59] hover:bg-[#f0f7f4] rounded-xl transition-all text-xs sm:text-sm font-bold active:scale-95"
              title="CMS Beranda"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">CMS Beranda</span>
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
        {/* Search Bar */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-100 mb-6 overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-base font-extrabold text-slate-800">Daftar Akun Pelanggan</h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari email, nomor HP, nama..."
                className="w-full pl-10 pr-8 py-2.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-100 p-16 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#4a7c59] mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Memuat data pelanggan...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-100 p-16 text-center">
            <div className="bg-[#f8faf9] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              {searchQuery ? 'Tidak Ditemukan' : 'Belum Ada Pelanggan'}
            </h3>
            <p className="text-slate-400 text-sm">
              {searchQuery 
                ? `Tidak ada akun yang cocok dengan "${searchQuery}"`
                : 'Belum ada pelanggan yang mendaftar atau login di toko.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-100 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4.5">Nama & Kontak</th>
                    <th className="px-6 py-4.5">Provider</th>
                    <th className="px-6 py-4.5">Terdaftar Pada</th>
                    <th className="px-6 py-4.5">Login Terakhir</th>
                    <th className="px-6 py-4.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const name = user.user_metadata?.full_name || '-';
                    const email = user.email || '-';
                    const phone = user.phone || '-';
                    const avatar = user.user_metadata?.avatar_url;
                    
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center space-x-3.5">
                            {avatar ? (
                              <img src={avatar} alt="" className="w-9 h-9 rounded-full border border-slate-100" />
                            ) : (
                              <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {(name !== '-' ? name : email !== '-' ? email : '?')[0].toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-extrabold text-slate-800 text-sm tracking-tight">{name}</p>
                              <p className="text-xs text-slate-400 font-semibold">{email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5">
                          <div className="space-y-0.5">
                            {phone !== '-' && (
                              <p className="text-xs font-bold text-slate-700">{phone}</p>
                            )}
                            <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                              {user.app_metadata?.provider || 'otp'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-xs font-bold text-slate-600">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4.5 text-xs font-bold text-slate-500">
                          {formatDate(user.last_sign_in_at)}
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id, user.email, user.phone)}
                            disabled={deletingId === user.id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors hover:shadow-sm disabled:opacity-50"
                            title="Hapus Pengguna"
                          >
                            {deletingId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const name = user.user_metadata?.full_name || '-';
                const email = user.email || '-';
                const phone = user.phone || '-';
                const avatar = user.user_metadata?.avatar_url;
                
                return (
                  <div key={user.id} className="p-5 space-y-3.5">
                    <div className="flex items-center space-x-3">
                      {avatar ? (
                        <img src={avatar} alt="" className="w-10 h-10 rounded-full border border-slate-100 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {(name !== '-' ? name : email !== '-' ? email : '?')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-slate-800 text-sm tracking-tight truncate">{name}</h4>
                        <p className="text-xs text-slate-400 font-semibold truncate">{email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id, user.email, user.phone)}
                        disabled={deletingId === user.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 flex-shrink-0 active:scale-95"
                        title="Hapus Pengguna"
                      >
                        {deletingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                      <div>
                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">Kontak / Provider</p>
                        <div className="space-y-0.5">
                          {phone !== '-' && <p className="font-bold text-slate-700">{phone}</p>}
                          <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                            {user.app_metadata?.provider || 'otp'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">Terdaftar</p>
                        <p className="font-semibold text-slate-600">{formatDate(user.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#f8faf9] rounded-xl p-2.5 flex justify-between items-center text-[10px] font-semibold text-slate-500 border border-slate-100">
                      <span>Login Terakhir:</span>
                      <span className="font-bold text-slate-600">{formatDate(user.last_sign_in_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
