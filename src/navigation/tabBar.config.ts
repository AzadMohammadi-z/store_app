const PADDING = 3;
const ITEM_HEIGHT = 58; // قبلاً ۵۸
const BORDER = 1;

export const TAB_BAR = {
  padding: PADDING,
  borderWidth: BORDER,
  itemHeight: ITEM_HEIGHT,
  barHeight: ITEM_HEIGHT + (PADDING + BORDER) * 2,
  sideMargin: 50,
  maxWidth: 420,
  minBottomInset: 12,
  iconSize: 22, // قبلاً ۲۵
  labelSize: 10.5, // قبلاً ۱۱.۵
  blurAmount: 80, // شدت بلور
  bubbleInset: 0, // هر چه بیشتر، حباب باریک‌تر و گردتر

  // حس انیمیشن (متناسب با اندازه‌ی کوچک‌تر)
  stretchMaxSteps: 3,
  iconJump: 7, // قبلاً ۹
  iconActiveScale: 1.08,
  dragThreshold: 8, // حداقل حرکت افقی (پیکسل) تا کشیدن شروع شود

  grabStretch: 0, // قبلاً ۲۲ //  عریض شدن حباب هنگام گرفتن
  grabGrow: 0, // بلندتر شدن حباب هنگام گرفتن (حداکثر دو برابر padding)  // قبلاً ۲۲
  iconGrabScale: 0, // قبلاً ۱.۲۲ (هم‌اندازه‌ی iconActiveScale)  // بزرگ شدن آیکون زیر حباب هنگام گرفتن
  stretchBase: 0, // قبلاً 10
  stretchPerStep: 0, // قبلاً 8
  squash: 0, // قبلاً 7
};

export const SLIDE_SPRING = { damping: 17, stiffness: 190, mass: 0.8 };
export const ICON_SPRING = { damping: 14, stiffness: 220, mass: 0.7 };
export const PULSE_SPRING = { damping: 8, stiffness: 160, mass: 0.8 };
export const LAND_SPRING = { damping: 6, stiffness: 240, mass: 0.7 };
export const DRAG_SPRING = { damping: 30, stiffness: 450, mass: 0.6 };
export const GRAB_SPRING = { damping: 14, stiffness: 220, mass: 0.7 };
