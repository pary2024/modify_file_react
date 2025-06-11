import plugin from 'tailwindcss/plugin';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        khmer: ['Battambang', 'sans-serif'],
      },
      colors: {
        primary: '#2c7be5', // Matches invoice's --primary-color
        secondary: '#6c757d', // Matches invoice's --secondary-color
        border: '#e9ecef', // Matches invoice's --border-color
        lightBg: '#f8f9fa', // Matches invoice's --light-bg
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none', /* Chrome, Safari */
        },
      });
    }),
  ],
};