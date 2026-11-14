import React from 'react';
import { Pressable } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedIcon, ThemedView } from '../../theme/themed';

export default function ThemeToggleButton() {
  const { isDark, toggleTheme, setPreference } = useTheme();
  const Icon = isDark ? Sun : Moon;

  return (
    <Pressable
      onPress={toggleTheme}
      onLongPress={() => setPreference('system')}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'تم روشن' : 'تم تیره'}
    >
      <ThemedView
        bg={t => t.card.background}
        border={t => t.card.border}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View
          key={isDark ? 'sun' : 'moon'}
          entering={ZoomIn.duration(300)}
        >
          <ThemedIcon Icon={Icon} size={22} color={t => t.text.primary} />
        </Animated.View>
      </ThemedView>
    </Pressable>
  );
}
