/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A1628',
          light: '#1a2942',
          dark: '#050a12',
        },
        accent: {
          DEFAULT: '#C9A84C',
          hover: '#b8993d',
          light: '#d4b86a',
          dark: '#a88a3f',
        },
        background: {
          DEFAULT: '#FAFAFA',
          alt: '#F4F4F0',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
