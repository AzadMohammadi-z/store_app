import React from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Bell,
  FileText,
  Headphones,
  Heart,
  LogOut,
  MapPin,
  MessageSquare,
  Star,
  Store,
  Tag,
} from 'lucide-react-native';
import AccountHeader from '../../components/account/AccountHeader';
import ActiveOrderCard, {
  type ActiveOrder,
} from '../../components/account/ActiveOrderCard';
import AppearanceSection from '../../components/account/AppearanceSwitch';
import LogoutButton from '../../components/account/LogoutButton';
import MenuList, {
  MenuRows,
  type MenuItem,
} from '../../components/account/MenuList';
import OrderStatusCard from '../../components/account/OrderStatusCard';
import type { OrderStatus } from '../../components/account/orderStatus';
import ProfileCard from '../../components/account/ProfileCard';
import Divider from '../../components/common/Divider';
import GlassCard from '../../components/common/GlassCard';
import Screen from '../../components/common/Screen';
import { useAuth } from '../../auth/AuthProvider';
import { SCREEN_PADDING, TAB_BAR_SPACE } from '../../constants/layout';
import { useModal } from '../../components/modal/ModalProvider';
import { useNavigation } from '@react-navigation/native';

// داده‌ی نمونه؛ بعداً از API می‌آید
const USER_NAME = 'کاربر نوازون';

const ORDER_COUNTS: Record<OrderStatus, number> = {
  pending: 1,
  preparing: 2,
  shipped: 1,
  delivered: 0,
};

const ACTIVE_ORDER: ActiveOrder = {
  number: '184520',
  packages: [
    {
      id: '1',
      storeName: 'فروشگاه یک',
      itemCount: 2,
      status: 'shipped',
      from: '#3B82F6',
      to: '#6D4AFF',
    },
    {
      id: '2',
      storeName: 'فروشگاه دو',
      itemCount: 1,
      status: 'preparing',
      from: '#EC4899',
      to: '#8B5CF6',
    },
  ],
};

const todo = () => {
  // TODO: رفتن به صفحه‌ی مربوطه
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'favorites',
    label: 'علاقه‌مندی‌ها',
    Icon: Heart,
    tone: 'red',
    onPress: todo,
  },
  {
    id: 'followed',
    label: 'فروشگاه‌های دنبال‌شده',
    Icon: Store,
    tone: 'indigo',
    onPress: todo,
  },
  {
    id: 'chats',
    label: 'گفتگوها با فروشندگان',
    Icon: MessageSquare,
    tone: 'teal',
    badge: 3,
    onPress: todo,
  },
  {
    id: 'addresses',
    label: 'آدرس‌های من',
    Icon: MapPin,
    tone: 'indigo',
    onPress: todo,
  },
  {
    id: 'reviews',
    label: 'نظرات من',
    Icon: Star,
    tone: 'indigo',
    onPress: todo,
  },
  {
    id: 'coupons',
    label: 'کدهای تخفیف',
    Icon: Tag,
    tone: 'red',
    onPress: todo,
  },
];

const SETTINGS_ITEMS: MenuItem[] = [
  {
    id: 'notifications',
    label: 'اعلان‌ها',
    Icon: Bell,
    tone: 'indigo',
    onPress: todo,
  },
  {
    id: 'support',
    label: 'پشتیبانی و راهنما',
    Icon: Headphones,
    tone: 'teal',
    onPress: todo,
  },
  {
    id: 'legal',
    label: 'قوانین و حریم خصوصی',
    Icon: FileText,
    tone: 'indigo',
    onPress: todo,
  },
];

/** ورود نرم و پله‌ای هر بخش */
function Reveal({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 7) * 70).duration(400)}
    >
      {children}
    </Animated.View>
  );
}

export default function AccountDashboardScreen() {
  const { phone, logout } = useAuth();
  const { showModal } = useModal();
  const navigation = useNavigation<any>();
  const menuItems = MENU_ITEMS.map(item =>
    item.id === 'addresses'
      ? { ...item, onPress: () => navigation.navigate('Addresses') }
      : item,
  );

  const confirmLogout = () =>
    showModal({
      icon: LogOut,
      tone: 'purple',
      title: 'از حساب خارج می‌شوید؟',
      message:
        'برای استفاده‌ی دوباره باید با شماره موبایل و کد تأیید وارد شوید.',
      actions: [
        { label: 'خروج', variant: 'brand', onPress: logout },
        { label: 'انصراف' },
      ],
    });

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: SCREEN_PADDING,
          paddingBottom: TAB_BAR_SPACE,
          gap: 16,
        }}
      >
        <Reveal index={0}>
          <AccountHeader onPressBell={todo} />
        </Reveal>

        <Reveal index={1}>
          <ProfileCard name={USER_NAME} phone={phone} onEdit={todo} />
        </Reveal>

        <Reveal index={2}>
          <OrderStatusCard
            counts={ORDER_COUNTS}
            onPressAll={() => navigation.navigate('Orders')}
            onPressStatus={status =>
              navigation.navigate('Orders', { filter: status })
            }
          />
        </Reveal>

        <Reveal index={3}>
          <ActiveOrderCard
            order={ACTIVE_ORDER}
            onTrack={() => navigation.navigate('Orders')}
          />
        </Reveal>

        <Reveal index={4}>
          <MenuList items={menuItems} />
        </Reveal>

        <Reveal index={5}>
          <GlassCard style={{ overflow: 'hidden', paddingBottom: 4 }}>
            <AppearanceSection />
            <View style={{ marginHorizontal: 16 }}>
              <Divider />
            </View>
            <MenuRows items={SETTINGS_ITEMS} />
          </GlassCard>
        </Reveal>

        <Reveal index={6}>
          <LogoutButton onPress={confirmLogout} />
        </Reveal>
      </ScrollView>
    </Screen>
  );
}
