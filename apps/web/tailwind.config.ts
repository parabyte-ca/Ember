import type { Config } from 'tailwindcss';
import { colors, typography } from '@ember/ui';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: colors.primary, foreground: '#ffffff' },
        secondary: { DEFAULT: colors.secondary, foreground: '#ffffff' },
        accent: { DEFAULT: colors.accent, foreground: colors.secondary },
        surface: colors.surface,
        destructive: { DEFAULT: colors.destructive, foreground: '#ffffff' },
        muted: { DEFAULT: '#F3F4F6', foreground: colors.muted },
        background: '#FFFFFF',
        foreground: colors.secondary,
        card: { DEFAULT: '#FFFFFF', foreground: colors.secondary },
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: colors.primary,
      },
      fontFamily: {
        display: [typography.display, 'serif'],
        sans: [typography.ui, 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-wheel': 'spinWheel 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        spinWheel: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(720deg)' } },
      },
    },
  },
  plugins: [],
};

export default config;
