import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import type { Tone } from '../account/IconTile';
import ModalCard, { type ModalAction } from './ModalCard';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemedView } from '../../theme/themed';

export type ModalConfig = {
  icon?: React.ComponentType<any>;
  tone?: Tone;
  title: string;
  message?: string;
  /** هیچ‌کدام، یکی یا چند دکمه */
  actions?: ModalAction[];
  /** با لمس بیرون یا دکمه‌ی برگشت اندروید بسته شود (پیش‌فرض true) */
  dismissable?: boolean;
  /** بعد از این مدت (میلی‌ثانیه) خودکار بسته شود؛ برای پیام‌های بدون دکمه */
  autoClose?: number;
  /** هنگام بسته شدن با لمس بیرون یا برگشت */
  onClose?: () => void;
};

type ModalContextValue = {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

const OUT_MS = 180;

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const { blurType } = useTheme();

  const [config, setConfig] = useState<ModalConfig | null>(null);
  const [mounted, setMounted] = useState(false);

  const fade = useSharedValue(0);
  const pop = useSharedValue(0.9);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideModal = useCallback(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);

    fade.value = withTiming(0, { duration: OUT_MS });
    pop.value = withTiming(0.95, { duration: OUT_MS });

    hideTimer.current = setTimeout(() => {
      setMounted(false);
      setConfig(null);
    }, OUT_MS + 20);
  }, [fade, pop]);

  const showModal = useCallback(
    (next: ModalConfig) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (autoTimer.current) clearTimeout(autoTimer.current);

      setConfig(next);
      setMounted(true);

      pop.value = 0.9;
      fade.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
      pop.value = withSpring(1, { damping: 16, stiffness: 220, mass: 0.8 });

      if (next.autoClose)
        autoTimer.current = setTimeout(hideModal, next.autoClose);
    },
    [fade, pop, hideModal],
  );

  const dismiss = useCallback(() => {
    config?.onClose?.();
    hideModal();
  }, [config, hideModal]);

  const handleAction = useCallback(
    (action: ModalAction) => {
      action.onPress?.();
      if (action.closeOnPress !== false) hideModal();
    },
    [hideModal],
  );

  // دکمه‌ی برگشت اندروید
  useEffect(() => {
    if (!mounted) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (config?.dismissable !== false) dismiss();
      return true;
    });
    return () => sub.remove();
  }, [mounted, config, dismiss]);

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (autoTimer.current) clearTimeout(autoTimer.current);
    },
    [],
  );

  const backdropStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: pop.value }, { translateY: (1 - fade.value) * 12 }],
  }));

  const value = useMemo(
    () => ({ showModal, hideModal }),
    [showModal, hideModal],
  );

  return (
    <ModalContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}

        {mounted && config ? (
          <View
            accessibilityViewIsModal
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 32,
              },
            ]}
          >
            {/* پس‌زمینه‌ی محو و تیره */}
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, backdropStyle]}
            >
              <BlurView
                blurType={blurType}
                blurAmount={14}
                style={StyleSheet.absoluteFill}
              />
              <ThemedView
                bg={t => t.modal.scrim}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>

            {/* لمس بیرون از کارت */}
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => {
                if (config.dismissable !== false) dismiss();
              }}
              accessible={false}
            />

            <Animated.View
              style={[{ width: '100%', maxWidth: 360 }, cardStyle]}
            >
              <ModalCard
                icon={config.icon}
                tone={config.tone}
                title={config.title}
                message={config.message}
                actions={config.actions}
                onActionPress={handleAction}
              />
            </Animated.View>
          </View>
        ) : null}
      </View>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside ModalProvider');
  return ctx;
}
