/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['"Cairo"', '"Noto Sans Arabic"', '"Amiri"', 'serif'],
      },
      direction: {
        'rtl': 'rtl'
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
        '.text-start': {
          'text-align': 'right',
        },
        '.text-end': {
          'text-align': 'left',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}