const light = {
  mode: 'light',
  brand: '#2AABEE',
  danger: '#FF3B30',
  blurType: 'light',

  text: {
    primary: '#111111',
    secondary: '#5F7096',
    active: '#111111',
    inactive: '#5F7096',
  },

  gradient: { from: '#3B82F6', to: '#8B5CF6' },

  background: {
    base: '#F6F4FF',
    blobs: [
      {
        id: 'b1',
        color: '#B9A6FF',
        x: 92,
        y: 6,
        rx: 75,
        ry: 30,
        opacity: 0.55,
      },
      {
        id: 'b2',
        color: '#9FD8FF',
        x: 0,
        y: 38,
        rx: 70,
        ry: 28,
        opacity: 0.55,
      },
      {
        id: 'b3',
        color: '#FFB8DA',
        x: 12,
        y: 88,
        rx: 75,
        ry: 30,
        opacity: 0.6,
      },
      {
        id: 'b4',
        color: '#C4A8FF',
        x: 95,
        y: 94,
        rx: 70,
        ry: 28,
        opacity: 0.55,
      },
    ],
    authBlobs: [
      { id: 'a1', color: '#B9A6FF', x: 88, y: 4, rx: 80, ry: 30, opacity: 0.6 },
      { id: 'a2', color: '#FFB8DA', x: 0, y: 50, rx: 60, ry: 25, opacity: 0.5 },
      {
        id: 'a3',
        color: '#9FD8FF',
        x: 95,
        y: 92,
        rx: 80,
        ry: 30,
        opacity: 0.55,
      },
    ],
  },

  card: {
    divider: 'rgba(211, 211, 212, 0.18)',
    background: 'rgba(255,255,255,0.65)',
    border: 'rgba(255,255,255,0.9)',
  },

  search: {
    background: 'rgba(255,255,255,0.7)',
    border: 'rgba(255,255,255,0.95)',
    focusBackground: 'rgba(255,255,255,0.95)',
    focusBorder: 'rgba(139,92,246,0.7)',
    placeholder: '#8A94AD',
  },

  slider: { sheenOpacity: 0.55 },

  tabBar: {
    tint: 'rgba(255,255,255,0.72)',
    border: 'rgba(255,255,255,0.85)',
    rim: 'rgba(255,255,255,0.9)',
    indicator: 'rgba(95,112,150,0.09)',
    indicatorBorder: 'rgba(255,255,255,0)',
    indicatorGrab: 'rgba(255,255,255,0.22)',
    indicatorBorderGrab: 'rgba(255,255,255,1)',
    badgeText: '#FFFFFF',
  },

  auth: {
    badgeBackground: 'rgba(124,58,237,0.10)',
    badgeBorder: 'rgba(124,58,237,0.35)',
    badgeText: '#6D3FE0',
    skipBackground: 'rgba(255,255,255,0.7)',
    skipBorder: 'rgba(255,255,255,0.95)',
    sheetBackground: 'rgba(255,255,255,0.72)',
    sheetBorder: 'rgba(255,255,255,0.95)',
    inputBackground: '#FFFFFF',
    inputBorder: 'rgba(95,112,150,0.28)',
    inputText: '#111111',
    codeBackground: 'rgba(95,112,150,0.10)',
    codeBorder: 'rgba(95,112,150,0.22)',
    link: '#7C3AED',
    buttonFrom: '#6D2FDB',
    buttonTo: '#1081BA',
    glow: '#8B5CF6',
    otpFilled: 'rgba(95,112,150,0.18)',
  },
  tones: {
    red: { bg: 'rgba(244,63,94,0.12)', icon: '#E11D48' },
    indigo: { bg: 'rgba(99,102,241,0.14)', icon: '#4F46E5' },
    teal: { bg: 'rgba(20,184,166,0.15)', icon: '#0F9D8F' },
    purple: { bg: 'rgba(139,92,246,0.15)', icon: '#7C3AED' },
    blue: { bg: 'rgba(59,130,246,0.14)', icon: '#2563EB' },
    amber: { bg: 'rgba(245,158,11,0.18)', icon: '#B7791F' },
  },
  account: {
    badge: '#5B4BE0',
    track: 'rgba(95,112,150,0.18)',
    segmentTrack: 'rgba(95,112,150,0.08)',
    segmentBorder: 'rgba(95,112,150,0.18)',
    segmentSelected: 'rgba(139,92,246,0.16)',
    segmentSelectedBorder: 'rgba(124,58,237,0.5)',
    logoutBackground: 'rgba(244,63,94,0.08)',
    logoutBorder: 'rgba(225,29,72,0.35)',
    logoutText: '#E11D48',
    trackButtonBackground: 'rgba(124,58,237,0.12)',
    trackButtonBorder: 'rgba(124,58,237,0.35)',
  },
};

const dark = {
  mode: 'dark',
  brand: '#4DB5FF',
  danger: '#FF453A',
  blurType: 'dark',

  text: {
    primary: '#F2F3F8',
    secondary: '#9AA3B8',
    active: '#FFFFFF',
    inactive: '#9AA3B8',
  },

  gradient: { from: '#3B82F6', to: '#8B5CF6' },

  background: {
    base: '#0A0A12',
    blobs: [
      {
        id: 'b1',
        color: '#6C4DFF',
        x: 92,
        y: 6,
        rx: 75,
        ry: 30,
        opacity: 0.38,
      },
      { id: 'b2', color: '#2F6BFF', x: 0, y: 38, rx: 70, ry: 28, opacity: 0.3 },
      {
        id: 'b3',
        color: '#7A3CFF',
        x: 12,
        y: 88,
        rx: 75,
        ry: 30,
        opacity: 0.34,
      },
      {
        id: 'b4',
        color: '#E0457B',
        x: 95,
        y: 94,
        rx: 70,
        ry: 28,
        opacity: 0.36,
      },
    ],
    authBlobs: [
      { id: 'a1', color: '#5B2DB8', x: 88, y: 4, rx: 80, ry: 30, opacity: 0.7 },
      {
        id: 'a2',
        color: '#8A2F5F',
        x: 0,
        y: 50,
        rx: 60,
        ry: 25,
        opacity: 0.45,
      },
      {
        id: 'a3',
        color: '#12607A',
        x: 95,
        y: 92,
        rx: 80,
        ry: 30,
        opacity: 0.55,
      },
    ],
  },

  card: {
    divider: 'rgba(128, 128, 128, 0.1)',
    background: 'rgba(255,255,255,0.07)',
    border: 'rgba(255,255,255,0.12)',
  },

  search: {
    background: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.14)',
    focusBackground: 'rgba(255,255,255,0.13)',
    focusBorder: 'rgba(167,139,250,0.8)',
    placeholder: '#7D869C',
  },

  slider: { sheenOpacity: 0.12 },

  tabBar: {
    tint: 'rgba(16,16,26,0.72)',
    border: 'rgba(255,255,255,0.12)',
    rim: 'rgba(255,255,255,0.16)',
    indicator: 'rgba(255,255,255,0.09)',
    indicatorBorder: 'rgba(255,255,255,0)',
    indicatorGrab: 'rgba(255,255,255,0.16)',
    indicatorBorderGrab: 'rgba(255,255,255,0.4)',
    badgeText: '#FFFFFF',
  },

  auth: {
    badgeBackground: 'rgba(139,92,246,0.16)',
    badgeBorder: 'rgba(139,92,246,0.45)',
    badgeText: '#B79DFF',
    skipBackground: 'rgba(255,255,255,0.07)',
    skipBorder: 'rgba(255,255,255,0.14)',
    sheetBackground: 'rgba(255,255,255,0.08)',
    sheetBorder: 'rgba(255,255,255,0.16)',
    inputBackground: '#12121C',
    inputBorder: 'rgba(255,255,255,0.14)',
    inputText: '#FFFFFF',
    codeBackground: 'rgba(255,255,255,0.16)',
    codeBorder: 'rgba(255,255,255,0.2)',
    link: '#A78BFA',
    buttonFrom: '#6D2FDB',
    buttonTo: '#1081BA',
    glow: '#8B5CF6',
    otpFilled: 'rgba(255,255,255,0.2)',
  },
  tones: {
    red: { bg: 'rgba(244,63,94,0.28)', icon: '#FF9DB1' },
    indigo: { bg: 'rgba(99,102,241,0.34)', icon: '#B4B9FF' },
    teal: { bg: 'rgba(20,184,166,0.28)', icon: '#6EE7E0' },
    purple: { bg: 'rgba(139,92,246,0.34)', icon: '#CDB8FF' },
    blue: { bg: 'rgba(59,130,246,0.32)', icon: '#A5C4FF' },
    amber: { bg: 'rgba(245,158,11,0.2)', icon: '#F8C555' },
  },
  account: {
    badge: '#5B4BE0',
    track: 'rgba(255,255,255,0.12)',
    segmentTrack: 'rgba(255,255,255,0.05)',
    segmentBorder: 'rgba(255,255,255,0.1)',
    segmentSelected: 'rgba(139,92,246,0.4)',
    segmentSelectedBorder: 'rgba(167,139,250,0.7)',
    logoutBackground: 'rgba(244,63,94,0.1)',
    logoutBorder: 'rgba(244,63,94,0.4)',
    logoutText: '#FF8FA8',
    trackButtonBackground: 'rgba(124,58,237,0.3)',
    trackButtonBorder: 'rgba(167,139,250,0.4)',
  },
};

const palettes = { light, dark };

// `colors` فقط برای tailwind.config.js و کدهای قدیمی (همیشه روشن) نگه داشته شده
module.exports = { palettes, colors: light };
