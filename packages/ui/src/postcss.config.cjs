module.exports = {
  plugins: {
    'postcss-import-ext-glob': {},
    'postcss-import': {},
    tailwindcss: require('./tailwind.config.cjs'),
    autoprefixer: {},
    'postcss-prefix-selector': {
      prefix:
        {
          gutenberg:
            '.gutenberg__editor .edit-post-visual-editor__content-area',
        }[process.env.PREFIX] || '',
    },
		'postcss-font-magician': {
      hosted: ['../static/public/fonts'],
      // async: '../static/public/fonts-async.js',
		}
  },
};
