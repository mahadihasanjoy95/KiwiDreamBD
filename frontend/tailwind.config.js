/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          deep:    '#4C1D95',
          DEFAULT: '#7C3AED',
          soft:    '#A78BFA',
          mid:     '#DDD6FE',
          light:   '#EDE9FE',
          accent:  '#F0ABFC',
        },
        nz:    { DEFAULT: '#16A34A', light: '#DCFCE7', dark: '#14532D' },
        bd:    { DEFAULT: '#DA291C', light: '#FEE2E2' },
        safe:  '#10B981',
        tight: '#F59E0B',
        risky: '#EF4444',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        bengali: ['Noto Sans Bengali', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'fade-up': {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.35s ease-out',
        'fade-up':        'fade-up 0.4s ease-out',
        shimmer:          'shimmer 2s linear infinite',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A78BFA 100%)',
        'gradient-nz':    'linear-gradient(135deg, #14532D 0%, #16A34A 100%)',
      },
      boxShadow: {
        'brand-sm': '0 2px 8px rgba(124,58,237,0.12)',
        'brand-md': '0 4px 16px rgba(124,58,237,0.16)',
        'brand-lg': '0 8px 32px rgba(124,58,237,0.20)',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-safe', 'bg-tight', 'bg-risky',
    'text-safe', 'text-tight', 'text-risky',
    'border-safe', 'border-tight', 'border-risky',
    'bg-nz', 'bg-bd',
  ],
}
