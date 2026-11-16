import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { storage } from '../services/storage';

const STORAGE_KEY = 'auth.isLoggedIn';
const PHONE_KEY = 'auth.phone';

type AuthContextValue = {
  isLoggedIn: boolean;
  phone: string;
  login: (phone?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => storage.getBoolean(STORAGE_KEY) ?? false,
  );
  const [phone, setPhone] = useState<string>(
    () => storage.getString(PHONE_KEY) ?? '',
  );

  const login = useCallback((p?: string) => {
    storage.set(STORAGE_KEY, true);
    if (p) {
      storage.set(PHONE_KEY, p);
      setPhone(p);
    }
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    storage.set(STORAGE_KEY, false);
    storage.set(PHONE_KEY, '');
    setPhone('');
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, phone, login, logout }),
    [isLoggedIn, phone, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
