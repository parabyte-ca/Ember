/** @type {import('tailwindcss').Config} */
const emberPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#E85A6B',
        secondary: '#1B1233',
        accent: '#F4C95D',
        surface: '#FBF7F4',
        destructive: '#EF4444',
        success: '#22C55E',
        muted: '#9CA3AF',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};

module.exports = emberPreset;
