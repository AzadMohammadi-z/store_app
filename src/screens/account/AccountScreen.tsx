import React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuth } from '../../auth/AuthProvider';
import AccountNavigator from '../../navigation/AccountNavigator';
import AccountDashboardScreen from './AccountDashboardScreen';

export default function AccountScreen() {
  const { isLoggedIn } = useAuth();

  return (
    <Animated.View
      key={isLoggedIn ? 'dashboard' : 'auth'}
      entering={FadeIn.duration(350)}
      style={{ flex: 1 }}
    >
      {isLoggedIn ? <AccountDashboardScreen /> : <AccountNavigator />}
    </Animated.View>
  );
}
