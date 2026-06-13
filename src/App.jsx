import { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './components/Toast';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminContentSettings from './pages/admin/AdminContentSettings';
import AdminUsers from './pages/admin/AdminUsers';
import TrackOrder from './pages/TrackOrder';
import UserLoginPage from './pages/UserLoginPage';
import { useAuth } from './context/AuthContext';
import { API_URL } from './config/api';

function App() {
  const [view, setView] = useState('home');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [adminUser, setAdminUser] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const { user, loading: authLoading } = useAuth();

  const navigate = (path) => {
    if (path === '/') setView('home');
    else if (path === '/cart') setView('cart');
    else if (path === '/checkout') setView('checkout');
    else if (path === '/track' || path === '/orders/track') setView('track');
    else if (path === '/login') setView('login');
    else if (path === '/admin/login') {
      // Jika sudah login, langsung ke dashboard
      if (adminToken) {
        setView('admin-dashboard');
      } else {
        setView('admin-login');
      }
    }
    else if (path === '/admin' || path === '/admin/dashboard') {
      // GUARD: Cek apakah sudah login
      if (!adminToken) {
        setView('home'); // Tendang ke home jika belum login
        return;
      }
      setView('admin-dashboard');
    }
    else if (path === '/admin/orders') {
      // GUARD: Cek apakah sudah login
      if (!adminToken) {
        setView('home'); // Tendang ke home jika belum login
        return;
      }
      setView('admin-orders');
    }
    else if (path === '/admin/settings') {
      // GUARD: Cek apakah sudah login
      if (!adminToken) {
        setView('home'); // Tendang ke home jika belum login
        return;
      }
      setView('admin-settings');
    }
    else if (path === '/admin/users') {
      // GUARD: Cek apakah sudah login
      if (!adminToken) {
        setView('home'); // Tendang ke home jika belum login
        return;
      }
      setView('admin-users');
    }
  };

  // Verifikasi token saat halaman dimuat
  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsVerifying(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setAdminToken(token);
        setAdminUser(data.admin);
      } else {
        // Token expired atau invalid
        localStorage.removeItem('adminToken');
        setAdminToken(null);
        setAdminUser(null);
      }
    } catch {
      // Server unreachable — keep token but don't verify
      console.warn('Tidak bisa verifikasi token ke server');
    } finally {
      setIsVerifying(false);
    }
  }, [API_URL]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  // Handle initial page routing from window.location.pathname on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path && path !== '/') {
      navigate(path);
    }
  }, []);

  // Handle post-login redirection for customers (e.g. from Google OAuth callback)
  useEffect(() => {
    if (user && !authLoading) {
      const redirectPath = sessionStorage.getItem('authRedirect');
      if (redirectPath) {
        sessionStorage.removeItem('authRedirect');
        navigate(redirectPath);
      }
    }
  }, [user, authLoading, navigate]);

  const handleLogin = (token, admin) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setAdminUser(admin);
    setView('admin-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setAdminUser(null);
    setView('home');
  };



  // Loading state saat verifikasi token
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4a7c59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <>
        {view === 'home' && <HomePage navigate={navigate} isAdmin={!!adminToken} />}
        {view === 'cart' && <CartPage navigate={navigate} />}
        {view === 'checkout' && <PaymentPage navigate={navigate} />}
        {view === 'track' && <TrackOrder navigate={navigate} />}
        {view === 'login' && <UserLoginPage navigate={navigate} />}
        {view === 'admin-login' && <AdminLogin onLogin={handleLogin} navigate={navigate} />}
        {view === 'admin-dashboard' && (
          adminToken 
            ? <AdminDashboard navigate={navigate} onLogout={handleLogout} adminToken={adminToken} adminUser={adminUser} /> 
            : (() => { setView('home'); return null; })()
        )}
        {view === 'admin-orders' && (
          adminToken 
            ? <AdminOrders navigate={navigate} onLogout={handleLogout} adminToken={adminToken} /> 
            : (() => { setView('home'); return null; })()
        )}
        {view === 'admin-settings' && (
          adminToken 
            ? <AdminContentSettings navigate={navigate} onLogout={handleLogout} adminToken={adminToken} adminUser={adminUser} /> 
            : (() => { setView('home'); return null; })()
        )}
        {view === 'admin-users' && (
          adminToken 
            ? <AdminUsers navigate={navigate} onLogout={handleLogout} adminToken={adminToken} adminUser={adminUser} /> 
            : (() => { setView('home'); return null; })()
        )}
      </>
    </ToastProvider>
  );
}

export default App;