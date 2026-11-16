import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { storage } from '../services/storage';

export type StoreInfo = {
  id: string;
  name: string;
  city?: string;
  /** هزینه‌ی ارسال این بسته (تومان) */
  shippingCost: number;
  /** زمان تقریبی ارسال، مثلاً «۱ تا ۳ روز کاری» */
  eta: string;
  /** رنگ‌های گرادیان آواتار فروشگاه */
  from?: string;
  to?: string;
};

export type CartLine = {
  id: string;
  name: string;
  specs?: string;
  /** قیمت یک عدد (تومان) */
  price: number;
  quantity: number;
  image?: { uri: string };
  /** رنگ‌های گرادیان جای عکس */
  from?: string;
  to?: string;
  store: StoreInfo;
};

export type CartGroup = {
  store: StoreInfo;
  lines: CartLine[];
  itemsTotal: number;
  /** کالاها + هزینه‌ی ارسال همین بسته */
  total: number;
};

const STORAGE_KEY = 'cart.lines';
const MAX_QUANTITY = 99;

function readLines(): CartLine[] {
  try {
    const raw = storage.getString(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type CartContextValue = {
  lines: CartLine[];
  groups: CartGroup[];
  /** مجموع تعداد کالاها */
  itemCount: number;
  packageCount: number;
  itemsTotal: number;
  shippingTotal: number;
  discount: number;
  payable: number;
  addItem: (item: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readLines);

  useEffect(() => {
    storage.set(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const addItem = useCallback(
    (item: Omit<CartLine, 'quantity'>, quantity = 1) => {
      setLines(prev => {
        const found = prev.find(l => l.id === item.id);
        if (found) {
          return prev.map(l =>
            l.id === item.id
              ? {
                  ...l,
                  quantity: Math.min(MAX_QUANTITY, l.quantity + quantity),
                }
              : l,
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    [],
  );

  const increment = useCallback((id: string) => {
    setLines(prev =>
      prev.map(l =>
        l.id === id
          ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + 1) }
          : l,
      ),
    );
  }, []);

  const decrement = useCallback((id: string) => {
    setLines(prev =>
      prev.map(l =>
        l.id === id ? { ...l, quantity: Math.max(1, l.quantity - 1) } : l,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines(prev => prev.filter(l => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const derived = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, CartGroup>();

    for (const line of lines) {
      let group = map.get(line.store.id);
      if (!group) {
        group = { store: line.store, lines: [], itemsTotal: 0, total: 0 };
        map.set(line.store.id, group);
        order.push(line.store.id);
      }
      group.lines.push(line);
      group.itemsTotal += line.price * line.quantity;
    }

    const groups = order.map(id => {
      const g = map.get(id)!;
      return { ...g, total: g.itemsTotal + g.store.shippingCost };
    });

    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
    const itemsTotal = groups.reduce((sum, g) => sum + g.itemsTotal, 0);
    const shippingTotal = groups.reduce(
      (sum, g) => sum + g.store.shippingCost,
      0,
    );
    const discount = 0; // TODO: محاسبه‌ی کد تخفیف

    return {
      groups,
      itemCount,
      packageCount: groups.length,
      itemsTotal,
      shippingTotal,
      discount,
      payable: Math.max(0, itemsTotal + shippingTotal - discount),
    };
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({ lines, ...derived, addItem, increment, decrement, remove, clear }),
    [lines, derived, addItem, increment, decrement, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
