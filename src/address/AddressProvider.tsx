import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Tone } from '../components/account/IconTile';
import { storage } from '../services/storage';

export type AddressFields = {
  name: string;
  /** ده رقم بدون صفر اول */
  phone: string;
  province: string;
  city: string;
  address: string;
  postal: string;
};

export type Address = AddressFields & {
  id: string;
  title: string;
  isDefault: boolean;
  /** رنگ کاشی آیکون */
  tone: Tone;
};

export type AddressInput = AddressFields & {
  title: string;
  isDefault?: boolean;
};

const STORAGE_KEY = 'addresses.list';
const TONES: Tone[] = [
  'purple',
  'teal',
  'red',
  'indigo',
  'blue',
  'amber',
  'green',
];

function readList(): Address[] {
  try {
    const raw = storage.getString(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const newId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

type AddressContextValue = {
  /** پیش‌فرض همیشه اول است */
  addresses: Address[];
  defaultAddress: Address | null;
  addAddress: (input: AddressInput) => void;
  updateAddress: (id: string, patch: Partial<AddressInput>) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
};

const AddressContext = createContext<AddressContextValue | null>(null);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Address[]>(readList);

  useEffect(() => {
    storage.set(STORAGE_KEY, JSON.stringify(list));
  }, [list]);

  const addAddress = useCallback((input: AddressInput) => {
    setList(prev => {
      const makeDefault = prev.length === 0 || !!input.isDefault;
      const created: Address = {
        ...input,
        id: newId(),
        isDefault: makeDefault,
        tone: TONES[prev.length % TONES.length],
      };
      const base = makeDefault
        ? prev.map(a => ({ ...a, isDefault: false }))
        : prev;
      return [...base, created];
    });
  }, []);

  const updateAddress = useCallback(
    (id: string, patch: Partial<AddressInput>) => {
      setList(prev =>
        prev.map(a => {
          if (a.id === id)
            return {
              ...a,
              ...patch,
              isDefault: patch.isDefault ?? a.isDefault,
            };
          return patch.isDefault ? { ...a, isDefault: false } : a;
        }),
      );
    },
    [],
  );

  const removeAddress = useCallback((id: string) => {
    setList(prev => {
      const next = prev.filter(a => a.id !== id);
      // اگر پیش‌فرض حذف شد، اولین آدرس باقی‌مانده پیش‌فرض می‌شود
      if (next.length > 0 && !next.some(a => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  }, []);

  const setDefault = useCallback((id: string) => {
    setList(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  }, []);

  const addresses = useMemo(
    () => [...list].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [list],
  );
  const defaultAddress = addresses[0]?.isDefault ? addresses[0] : null;

  const value = useMemo(
    () => ({
      addresses,
      defaultAddress,
      addAddress,
      updateAddress,
      removeAddress,
      setDefault,
    }),
    [
      addresses,
      defaultAddress,
      addAddress,
      updateAddress,
      removeAddress,
      setDefault,
    ],
  );

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddresses must be used inside AddressProvider');
  return ctx;
}
