/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#dee6e0',
        teal: '#1d5450',
        aqua: '#248680',
        celadon: '#dee6e0',
        accent: '#e85a1c',
        amber:'#b3c5c0'
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        elegant: ['Smooch Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}