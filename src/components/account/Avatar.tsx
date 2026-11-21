import React from 'react';
import { Pressable, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import GradientBox from '../common/GradientBox';
import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  size?: number;
  /** اگر داده شود، دکمه‌ی دوربین گوشه‌ی آواتار نشان داده می‌شود */
  onCameraPress?: () => void;
};

export default function Avatar({ size = 66, onCameraPress }: Props) {
  const { theme } = useTheme();
  const badge = Math.round(size * 0.36);

  return (
    <View style={{ width: size, height: size }}>
      <GradientBox
        from="#6D4AFF"
        to="#3B82F6"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size > 80 ? 3 : 2,
          borderColor: 'rgba(167,139,250,0.55)',
        }}
      />

      {onCameraPress ? (
        <Pressable
          onPress={onCameraPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="تغییر تصویر پروفایل"
          style={{ position: 'absolute', left: 0, bottom: 0 }}
        >
          <GradientBox
            from={theme.auth.buttonFrom}
            to={theme.auth.buttonTo}
            style={{
              width: badge,
              height: badge,
              borderRadius: badge / 2,
              borderWidth: 3,
              borderColor: theme.background.base,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Camera
              size={Math.round(badge * 0.5)}
              color="#FFFFFF"
              strokeWidth={2.2}
            />
          </GradientBox>
        </Pressable>
      ) : null}
    </View>
  );
}
