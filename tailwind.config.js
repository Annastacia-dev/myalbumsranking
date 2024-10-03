/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['"Montserrat", system-ui'],
      },
      colors: {
        "primary": '#141B41',
        "secondary": '#306BAC',
        "tertiary": '#6F9CEB',
        "postgrad": '#98B9F2',
        'phd': '#918EF4'
      }
    },
  },
  plugins: [],
};
