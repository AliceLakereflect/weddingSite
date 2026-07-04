import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#faf7f2',
          100: '#f0e8d6',
          200: '#dcc9a8',
          300: '#c9a97a',
          400: '#b8894e',
          500: '#9a6e3a',
          600: '#7d5530',
          700: '#634226',
          800: '#4a301c',
          900: '#311f12',
        },
        forest: {
          50: '#f2f7f0',
          100: '#daebd4',
          200: '#b4d6a8',
          300: '#8dbd7b',
          400: '#69a452',
          500: '#4d8a37',
          600: '#3a6e2a',
          700: '#2a5220',
          800: '#1c3816',
          900: '#101f0c',
        },
        cream: '#faf8f3',
        charcoal: '#2d2926',
        gold: '#c9a84c',
        champagne: '#d4b896',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        serif: ['"Noto Serif TC"', 'serif'],
        sans: ['"Noto Sans TC"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(to bottom, rgba(45,41,38,0.35) 0%, rgba(45,41,38,0.55) 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
