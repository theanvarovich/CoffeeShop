/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#0a0908',           // near-black espresso
          surface: '#1c1713',      // deep charcoal / bean
          accent: '#d4a373',       // warm coffee gold / caramel brass
          'accent-dark': '#b58955',
          text: '#f8f1e9',         // warm cream
          'text-muted': '#c9b8a8',   // taupe
          vegan: '#4a7043',        // deep sage
          decaf: '#6b7280',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-.04em',
        tighter: '-.02em',
      },
      borderRadius: {
        'brand': '16px',
      }
    },
  },
  plugins: [],
}
