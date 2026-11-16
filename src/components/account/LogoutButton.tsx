import React from 'react';
import { Pressable } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { fonts } from '../../theme/fonts';
import { ThemedIcon, ThemedText, ThemedView } from '../../theme/themed';

export default function LogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="خروج از حساب"
    >
      <ThemedView
        bg={t => t.account.logoutBackground}
        border={t => t.account.logoutBorder}
        style={{
          height: 60,
          borderRadius: 22,
          borderWidth: 1,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <ThemedText
          color={t => t.account.logoutText}
          style={{ fontFamily: fonts.bold, fontSize: 16 }}
        >
          خروج از حساب
        </ThemedText>
        <ThemedIcon
          Icon={LogOut}
          size={20}
          strokeWidth={2.2}
          color={t => t.account.logoutText}
        />
      </ThemedView>
    </Pressable>
  );
}
