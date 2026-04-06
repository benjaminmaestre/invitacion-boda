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
      },
      keyframes: {
        'scroll-indicator': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(12px)', opacity: '1' },
        },
        'apple-reveal': {
          'from': { opacity: '0', transform: 'translateY(40px) scale(0.98)', filter: 'blur(15px)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        },
        'fade-in-zoom': {
          'from': { opacity: '0', transform: 'scale(0.8)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        'scroll-indicator': 'scroll-indicator 2.5s ease-in-out infinite',
        'apple-reveal': 'apple-reveal 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-zoom': 'fade-in-zoom 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      }
    },
  },
  plugins: [],
}
