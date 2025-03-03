/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#646cff',
        'primary-dark': '#535bf2',
        'dark': '#121212',
        'card': '#1a1a1a',
        'purple': {
          100: '#e9d8fd',
          500: '#9f7aea',
          700: '#6b46c1',
          900: '#44337a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}