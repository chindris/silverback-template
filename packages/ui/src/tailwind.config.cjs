/** @type {import('tailwindcss').Config} */
const theme = require('./stylingAssets.json');

module.exports = {
  content: ['./src/**/*.{tsx, mdx}'],
  ...theme,
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
};
