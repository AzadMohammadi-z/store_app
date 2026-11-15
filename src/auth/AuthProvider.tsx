import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { storage } from '../services/storage';

const STORAGE_KEY = 'auth.isLoggedIn';

type AuthContextValue = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => storage.getBoolean(STORAGE_KEY) ?? false,
  );

  const login = useCallback(() => {
    storage.set(STORAGE_KEY, true);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    storage.set(STORAGE_KEY, false);
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, login, logout }),
    [isLoggedIn, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
