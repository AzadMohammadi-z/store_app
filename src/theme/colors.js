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
  },

  card: {
    background: 'rgba(255,255,255,0.65)',
    border: 'rgba(255,255,255,0.9)',
  },

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
  },

  card: {
    background: 'rgba(255,255,255,0.07)',
    border: 'rgba(255,255,255,0.12)',
  },

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
};

const palettes = { light, dark };

// `colors` فقط برای tailwind.config.js و کدهای قدیمی (همیشه روشن) نگه داشته شده
module.exports = { palettes, colors: light };
