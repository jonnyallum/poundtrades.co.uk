/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors can be added here
        // For example:
        // primary: '#facc15', // Yellow
        // secondary: '#000000', // Black
      },
      fontFamily: {
        // Custom fonts can be added here if needed
      },
    },
  },
  plugins: [],
}