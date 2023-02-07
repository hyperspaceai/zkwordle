/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        shake: 'dance 500ms ease-in-out',
        flip: 'flip 500ms linear',
      },
      keyframes: {
        flip: {
          '0%': {
            transform: 'rotateX(0deg)',
          },
          '100%': {
            transform: 'rotateX(90deg)',
          },
        },
        dance: {
          '20%': {
            transform: 'translateY(-50%)',
          },

          '40%': {
            transform: 'translateY(5%)',
          },

          '60%': {
            transform: 'translateY(-25%)',
          },

          '80%': {
            transform: 'translateY(2.5%)',
          },

          '90%': {
            transform: 'translateY(-5%)',
          },

          '100%': {
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};
