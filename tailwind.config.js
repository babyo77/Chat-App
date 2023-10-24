/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['*'],
  theme: {
    extend: {
      fontFamily:{
        'poppins':['poppins','sans'],
      },
    },
  },
  plugins: [
    {
      tailwindcss: {},
autoprefixer: {},
    }
  ],
}