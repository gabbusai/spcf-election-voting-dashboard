/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title:['"Climate Crisis"', 'sans-serif'],
        bebasNeue:['"Bebas Neue"', 'sans-serif']
      }
    },
  },
  plugins: [],
}