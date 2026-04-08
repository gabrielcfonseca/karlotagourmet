/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mocha:   '#5C4033',
        cream:   '#FAF0E6',
        gold:    '#C9A84C',
        darkbrown: '#3B2A1A',
        'mocha-light': '#7A5C4F',
        'mocha-dark':  '#3E2B20',
        'gold-light':  '#E2C47A',
        'gold-dark':   '#A8832A',
        'cream-dark':  '#F0DEC8',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        lato:     ['Lato', 'Helvetica Neue', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(44,27,17,0.72) 0%, rgba(44,27,17,0.55) 60%, rgba(44,27,17,0.80) 100%)',
      },
      animation: {
        'fade-up':   'fadeUp 0.7s ease-out forwards',
        'fade-in':   'fadeIn 0.5s ease-out forwards',
        'shimmer':   'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
