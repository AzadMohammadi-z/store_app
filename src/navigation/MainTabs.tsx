import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import HomeScreen from '../screens/home/HomeScreen';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import CartScreen from '../screens/cart/CartScreen';
import AccountScreen from '../screens/account/AccountScreen';
import type { MainTabParamList } from './types';
import { useCart } from '../cart/CartProvider';
import { toFaDigits } from '../utils/format';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const { itemCount } = useCart();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'خانه' }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'دسته‌بندی' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'سبد خرید',
          tabBarBadge:
            itemCount > 0 ? toFaDigits(String(itemCount)) : undefined,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: 'حساب من' }}
      />
    </Tab.Navigator>
  );
}
