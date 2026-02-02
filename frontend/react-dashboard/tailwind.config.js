/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFB5B5',
          400: '#FF9B9B',
          500: '#FF8A8A',
          600: '#FF6B6B',
        },
        charcoal: {
          900: '#2D2D2D',
          800: '#3D3D3D',
          700: '#4D4D4D',
        }
      },
      fontFamily: {
        display: ['Fredoka', 'Poppins', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'playful': '4px 4px 0px 0px rgba(45, 45, 45, 1)',
        'playful-lg': '6px 6px 0px 0px rgba(45, 45, 45, 1)',
        'playful-hover': '2px 2px 0px 0px rgba(45, 45, 45, 1)',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
