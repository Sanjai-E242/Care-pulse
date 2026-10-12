/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        healthcare: {
          blue: '#1e40af',
          sky: '#0284c7',
          lightBlue: '#f0f9ff',
          teal: '#0f766e',
          alertRed: '#dc2626',
          alertAmber: '#d97706',
          successGreen: '#16a34a'
        }
      }
    },
  },
  plugins: [],
}
