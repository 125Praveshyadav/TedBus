/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 Ye line zaroori hai
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // TedBus theme colors
    },
  },
  plugins: [],
}