/** @type {import('tailwindcss').Config} */
module.exports = {
  // Configuration NativeWind pour React Native
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Couleurs personnalisées basées sur le design purple
      colors: {
        primary: {
          50: '#f3f1ff',
          100: '#e9e5ff',
          200: '#d6ceff',
          300: '#b8a6ff',
          400: '#9575ff',
          500: '#7c3aed', // Couleur principale purple du design
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3c1a78',
        },
        // Couleur purple exacte du design
        purple: {
          design: '#7c3aed',
        }
      },
      // Rayons de bordure pour les formes arrondies du design
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
      },
      // Espacement personnalisé pour les zones tactiles
      spacing: {
        '11': '44px', // Zone tactile minimale 44x44 dp
      }
    },
  },
  plugins: [],
}
