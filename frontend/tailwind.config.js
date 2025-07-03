/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shroomStart: '#5C258D',
        shroomEnd: '#4389A2',
        actionYellow: '#FFEB3B',
        actionYellowHover: '#FDD835',
        darkNav: '#212121',
        darkFooter: '#424242',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
