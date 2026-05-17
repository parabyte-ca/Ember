import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E85A6B',
        secondary: '#1B1233',
        accent: '#F4C95D',
      },
    },
  },
  plugins: [],
};

export default config;
