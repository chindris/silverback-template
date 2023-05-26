module.exports = {
  plugins: {
    'postcss-import-ext-glob': {},
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefix-selector': {
      prefix:
        {
          gutenberg:
            '.gutenberg__editor .edit-post-visual-editor__content-area',
        }[process.env.PREFIX] || '',
    },
  },
};
