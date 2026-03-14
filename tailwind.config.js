/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'acento': '#7d5c43',
        'acento-oscuro': '#5a402e',
        'acento-claro': '#d4b48a',
        'fondo': '#f8f3ec',
        'fondo-sec': '#efe7dc',
        'texto': '#2f241a',
        'texto-suave': '#6f5c49',
      },
      fontFamily: {
        'script': ['"Great Vibes"', 'cursive'],
        'serif': ['"Cormorant Garamond"', 'serif'],
        'body': ['"Raleway"', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 18px 40px rgba(54, 38, 24, 0.14)',
      }
    },
  },
  plugins: [],
}
