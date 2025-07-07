/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#0288D1',      // Button Sign In (bright blue)
        secondaryBlue: '#1A237E',    // Button Create Account (dark blue)
        primaryText: '#000000',      // Black text
        pageBg: '#FFFFFF',           // White background
        divider: '#000000',          // Divider under nav
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
