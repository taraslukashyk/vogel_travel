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
      }
    },
  },
  plugins: [],
}

