import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';

interface AuthContextType {
  user: UserAccount | null;
  token: string | null;
  adminPasskey: string | null;
  isAdminAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, businessName: string) => Promise<boolean>;
  logout: () => void;
  loginAdmin: (passkey: string) => Promise<boolean>;
  logoutAdmin: () => void;
  savedSearches: Array<{
    id: string;
    phone: string;
    maskedPhone: string;
    timestamp: string;
    riskLevel: string;
    verifiedCouriers: number;
  }>;
  refreshSavedSearches: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  adminPasskey: null,
  isAdminAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  loginAdmin: async () => false,
  logoutAdmin: () => {},
  savedSearches: [],
  refreshSavedSearches: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('xbz_auth_token'));
  const [adminPasskey, setAdminPasskey] = useState<string | null>(() => localStorage.getItem('xbz_admin_key'));
  const [savedSearches, setSavedSearches] = useState<any[]>([]);

  // Check current session on mount
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          const ct = res.headers.get('content-type') || '';
          if (!ct.includes('application/json')) throw new Error('Non-JSON response');
          return res.json();
        })
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            setSavedSearches(data.user.savedSearches || []);
          } else {
            localStorage.removeItem('xbz_auth_token');
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {
          // Keep offline state gracefully
        });
    }
  }, [token]);

  const refreshSavedSearches = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/merchant/searches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) return;
      const data = await res.json();
      if (data.success && data.savedSearches) {
        setSavedSearches(data.savedSearches);
      }
    } catch {
      // ignore
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) return false;
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('xbz_auth_token', data.token);
        setSavedSearches(data.user.savedSearches || []);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, businessName: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, businessName }),
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) return false;
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('xbz_auth_token', data.token);
        setSavedSearches([]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSavedSearches([]);
    localStorage.removeItem('xbz_auth_token');
  };

  const loginAdmin = async (passkey: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/health', {
        headers: { 'x-admin-key': passkey },
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) return false;
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAdminPasskey(passkey);
          localStorage.setItem('xbz_admin_key', passkey);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdminPasskey(null);
    localStorage.removeItem('xbz_admin_key');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        adminPasskey,
        isAdminAuthenticated: Boolean(adminPasskey),
        login,
        register,
        logout,
        loginAdmin,
        logoutAdmin,
        savedSearches,
        refreshSavedSearches,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
