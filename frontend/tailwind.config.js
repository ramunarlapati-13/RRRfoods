/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          DEFAULT: '#8B261E',
          dark: '#6B1B14',
          light: '#B03028',
        },
        ochre: {
          DEFAULT: '#E5A93C',
          dark: '#C48A1E',
          light: '#F0C060',
        },
        slate: {
          950: '#0A0A0A',
          900: '#121212',
          800: '#1E1E1E',
          700: '#2A2A2A',
          600: '#3A3A3A',
        },
        cream: {
          DEFAULT: '#FAF9F6',
          dark: '#EDE8DF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #8B261E 0%, #121212 50%, #3A1A00 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)',
        'ochre-gradient': 'linear-gradient(135deg, #E5A93C 0%, #C48A1E 100%)',
        'clay-gradient': 'linear-gradient(135deg, #B03028 0%, #6B1B14 100%)',
      },
      boxShadow: {
        'glow-clay': '0 0 30px rgba(139,38,30,0.4)',
        'glow-ochre': '0 0 30px rgba(229,169,60,0.4)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 16px 48px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,38,30,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139,38,30,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
