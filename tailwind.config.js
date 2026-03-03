/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2F7',
          100: '#D4E1EE',
          200: '#A9C3DD',
          300: '#7FA5CC',
          400: '#5487BB',
          500: '#4A6FA5',
          600: '#3B5998',
          700: '#2E4A7C',
          800: '#213B60',
          900: '#142C44',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base reset to avoid conflicts with Vuetify
  },
}
