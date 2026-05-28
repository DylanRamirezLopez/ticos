/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        ticos: {
          bg: '#FAFAFA',
          'dark-bg': '#0A0A0A',
          'dark-card': '#1A1A1A',
          'dark-border': '#2A2A2A',
          'dark-hover': '#252525',
          card: '#FFFFFF',
          primary: '#1A1A1A',
          'dark-primary': '#F0F0F0',
          secondary: '#8E8E8E',
          'dark-secondary': '#6B6B6B',
          accent: '#0095F6',
          'dark-accent': '#1DA1F2',
          'like-red': '#ED4956',
          'story-start': '#F58529',
          'story-mid': '#DD2A7B',
          'story-end': '#8134AF',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        '2xs': '11px',
      },
      boxShadow: {
        'ticos': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'ticos-lg': '0 4px 24px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
