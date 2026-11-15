import React from 'react';
import { ScrollView } from 'react-native';
import GradientButton from '../../components/common/GradientButton';
import Screen from '../../components/common/Screen';
import { useAuth } from '../../auth/AuthProvider';
import { SCREEN_PADDING, TAB_BAR_SPACE } from '../../constants/layout';
import { fonts } from '../../theme/fonts';
import { ThemedText, ThemedView } from '../../theme/themed';

export default function AccountDashboardScreen() {
  const { logout } = useAuth();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          padding: SCREEN_PADDING,
          paddingBottom: TAB_BAR_SPACE,
          gap: 16,
        }}
      >
        <ThemedText
          color={t => t.text.primary}
          style={{ fontFamily: fonts.bold, fontSize: 22, textAlign: 'right' }}
        >
          حساب من
        </ThemedText>

        <ThemedView
          bg={t => t.card.background}
          border={t => t.card.border}
          style={{ borderWidth: 1, borderRadius: 24, padding: 20, gap: 6 }}
        >
          <ThemedText
            color={t => t.text.primary}
            style={{ fontFamily: fonts.bold, fontSize: 16, textAlign: 'right' }}
          >
            خوش آمدید
          </ThemedText>
          <ThemedText
            color={t => t.text.secondary}
            style={{
              fontFamily: fonts.regular,
              fontSize: 13,
              textAlign: 'right',
            }}
          >
            داشبورد حساب شما این‌جا قرار می‌گیرد.
          </ThemedText>
        </ThemedView>

        <GradientButton
          label="خروج از حساب"
          onPress={logout}
          from="#EF4444"
          to="#F43F5E"
        />
      </ScrollView>
    </Screen>
  );
}
