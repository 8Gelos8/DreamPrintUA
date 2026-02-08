/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['Comfortaa', 'cursive'],
        handwriting: ['Indie Flower', 'cursive'],
      },
      colors: {
        'dream-cyan': '#00C2FF',
        'dream-yellow': '#FFD600',
        'dream-orange': '#FF9900',
        'dream-pink': '#FF3399',
        'dream-green': '#33CC33',
        'dream-purple': '#9933FF',
        'dream-blue': '#3366FF',
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    }
  },
  plugins: [],
}
