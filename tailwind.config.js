const { colors } = require('./src/theme/colors');
const { fonts } = require('./src/theme/fonts');

module.exports = {
  darkMode: 'class',
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        danger: colors.danger,
        ink: colors.text.active,
        muted: colors.text.inactive,
      },
      fontFamily: {
        vazir: [fonts.regular],
        'vazir-medium': [fonts.medium],
        'vazir-bold': [fonts.bold],
        'vazir-extrabold': [fonts.extrabold],
      },
    },
  },
  plugins: [],
};
