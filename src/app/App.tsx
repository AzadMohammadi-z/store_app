import '../../global.css';
import React, { useEffect, useMemo, useState } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '../navigation/RootNavigator';
import AppSplash from '../components/AppSplash';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';
import { StatusBar, View } from 'react-native';
import AppBackground from '../components/common/AppBackground';
import { AuthProvider } from '../auth/AuthProvider';
import { CartProvider } from '../cart/CartProvider';
import { ModalProvider } from '../components/modal/ModalProvider';
import { AddressProvider } from '../address/AddressProvider';

function ThemedApp() {
  const { theme, isDark, blurType } = useTheme();

  // رنگ زمینه‌ی ناوبری را هم‌رنگ پس‌زمینه می‌کنیم تا هنگام انتقال صفحه‌ها فلش سفید نبینی
  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: 'transparent',
        card: 'transparent',
        primary: theme.brand,
      },
    };
  }, [isDark, theme]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppBackground />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [splashGone, setSplashGone] = useState(false);

  useEffect(() => {
    const init = async () => {
      // اینجا توکن، فونت، دیتای اولیه و ... رو لود کن
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
    };
    init().finally(() => setAppReady(true));
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AddressProvider>
              <ModalProvider>
                <ThemedApp />
              </ModalProvider>
            </AddressProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
      {!splashGone && (
        <AppSplash visible={!appReady} onHidden={() => setSplashGone(true)} />
      )}
    </SafeAreaProvider>
  );
}
