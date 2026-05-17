/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#E85A6B', foreground: '#ffffff' },
        secondary: { DEFAULT: '#1B1233', foreground: '#ffffff' },
        accent: { DEFAULT: '#F4C95D', foreground: '#1B1233' },
        surface: '#FBF7F4',
        background: '#1B1233',
        foreground: '#FBF7F4',
        muted: { DEFAULT: '#2D2050', foreground: '#9CA3AF' },
        border: '#2D2050',
        card: { DEFAULT: '#24194A', foreground: '#FBF7F4' },
      },
    },
  },
  plugins: [],
};
