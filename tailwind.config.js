/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs",
    "./src/public/**/*.html"
  ],

  safelist: [
    'bg-white',
    'bg-yellow-200',
    'bg-green-200',
    'bg-blue-200',
    'bg-pink-200'
  ],

  theme: {
    extend: {
      fontFamily: {
        vietnam: ['"Be Vietnam Pro"', 'sans-serif'],
      },
    },
  },

  plugins: [],
};