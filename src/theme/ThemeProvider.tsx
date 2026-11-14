import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import {
  type SharedValue,
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colorScheme as nativewindScheme } from 'nativewind';
import { storage } from '../services/storage';
import { palettes } from './colors';

export type Theme = typeof palettes.light;
export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode | 'system';

const STORAGE_KEY = 'theme.preference';

// مدت انیمیشن تغییر تم (میلی‌ثانیه)
const DURATION = 650;

function readPreference(): ThemePreference {
  const saved = storage.getString(STORAGE_KEY);
  return saved === 'light' || saved === 'dark' || saved === 'system'
    ? saved
    : 'system';
}

type ThemeContextValue = {
  /** تم واقعی که الان نمایش داده می‌شود */
  mode: ThemeMode;
  isDark: boolean;
  theme: Theme;
  /** انتخاب کاربر: روشن، تیره یا از روی تنظیم گوشی */
  preference: ThemePreference;
  /** ۰ = کاملاً روشن، ۱ = کاملاً تیره (در حین انیمیشن بین این دو) */
  progress: SharedValue<number>;
  /** نوع بلور؛ وسط انیمیشن عوض می‌شود */
  blurType: ThemeMode;
  setPreference: (preference: ThemePreference) => void;
  /** بین روشن و تیره جابه‌جا می‌کند و انتخاب را ذخیره می‌کند */
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] =
    useState<ThemePreference>(readPreference);

  const mode: ThemeMode =
    (preference === 'system' ? system : preference) === 'dark'
      ? 'dark'
      : 'light';

  const [blurType, setBlurType] = useState<ThemeMode>(mode);
  const progress = useSharedValue(mode === 'dark' ? 1 : 0);

  const modeRef = useRef(mode);
  modeRef.current = mode;

  // هماهنگ کردن NativeWind (کلاس‌های dark:) با انتخاب کاربر
  useEffect(() => {
    nativewindScheme.set(preference);
  }, [preference]);

  // هر بار تم واقعی عوض شد (دستی یا با تغییر تم گوشی)، نرم انیمیت می‌شود
  useEffect(() => {
    progress.value = withTiming(mode === 'dark' ? 1 : 0, {
      duration: DURATION,
      easing: Easing.inOut(Easing.cubic),
    });

    // نوع بلور نرم انیمیت نمی‌شود؛ وسط انیمیشن عوض می‌شود
    const timer = setTimeout(() => setBlurType(mode), DURATION / 2);
    return () => clearTimeout(timer);
  }, [mode, progress]);

  const setPreference = useCallback((next: ThemePreference) => {
    storage.set(STORAGE_KEY, next);
    setPreferenceState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(modeRef.current === 'dark' ? 'light' : 'dark');
  }, [setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      theme: mode === 'dark' ? palettes.dark : palettes.light,
      preference,
      progress,
      blurType,
      setPreference,
      toggleTheme,
    }),
    [mode, preference, blurType, progress, setPreference, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
