import { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the Supabase client if credentials are properly configured
const supabase =
  supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-project-url'
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

/**
 * Provides Supabase authentication state and methods to its children.
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let subscription;

    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error('Failed to get initial session:', err);
      } finally {
        setLoading(false);
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
        }
      );

      subscription = authListener.subscription;
    };

    initSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Sends a one-time password to the given phone number.
   * @param {string} phone
   * @returns {Promise<{ data: any, error: any }>}
   */
  const loginWithOTP = async (phone) => {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };
    try {
      const { data, error } = await supabase.auth.signInWithOtp({ phone });
      return { data, error };
    } catch (err) {
      console.error('loginWithOTP error:', err);
      return { data: null, error: err };
    }
  };

  /**
   * Verifies an OTP token sent to the given phone number.
   * @param {string} phone
   * @param {string} token
   * @returns {Promise<{ data: any, error: any }>}
   */
  const verifyOTP = async (phone, token) => {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      return { data, error };
    } catch (err) {
      console.error('verifyOTP error:', err);
      return { data: null, error: err };
    }
  };

  /**
   * Initiates OAuth sign-in with Google.
   * @returns {Promise<{ data: any, error: any }>}
   */
  const loginWithGoogle = async () => {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      return { data, error };
    } catch (err) {
      console.error('loginWithGoogle error:', err);
      return { data: null, error: err };
    }
  };

  /**
   * Signs the current user out.
   * @returns {Promise<{ data: any, error: any }>}
   */
  const logout = async () => {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };
    try {
      const { data, error } = await supabase.auth.signOut();
      return { data, error };
    } catch (err) {
      console.error('logout error:', err);
      return { data: null, error: err };
    }
  };

  const value = {
    user,
    session,
    loading,
    loginWithOTP,
    verifyOTP,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access the authentication context.
 * @throws {Error} If used outside of an AuthProvider.
 * @returns {React.ContextType<typeof AuthContext>}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
