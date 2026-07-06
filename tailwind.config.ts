import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d'
        },
        soil: {
          100: '#f5ead7',
          700: '#8b5e34'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
