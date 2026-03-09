/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EC4899",
        secondary: "#F472B6",
        cta: "#06B6D4",
        background: "#FDF2F8",
        foreground: "#831843",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        script: ['"Marck Script"', 'cursive'],
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}

