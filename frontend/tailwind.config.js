/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        teal: {
          600: '#0F766E',
          700: '#0F5157',
        },
        bgMain: '#F8FAFC',
        textDark: '#0F172A',
        textMuted: '#64748B',
        warningHex: '#F59E0B',
        highRiskHex: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
