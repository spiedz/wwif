/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D32F2F",
        "primary-dark": "#B71C1C",
        white: "#FFFFFF",
        "light-gray": "#F5F5F5",
        "dark-gray": "#424242",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#424242',
            a: {
              color: '#D32F2F',
              '&:hover': {
                color: '#B71C1C',
              },
            },
            h1: {
              color: '#D32F2F',
              fontWeight: '700',
            },
            h2: {
              color: '#D32F2F',
              fontWeight: '700',
            },
            h3: {
              color: '#D32F2F',
              fontWeight: '600',
            },
            strong: {
              color: '#424242',
            },
            blockquote: {
              color: '#6B7280',
              borderLeftColor: '#D32F2F',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 