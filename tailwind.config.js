/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nohemi', 'sans-serif'],
        'unique': ['Unique', 'sans-serif'],
        'nohemi': ['Nohemi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
