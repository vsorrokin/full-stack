const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// stylus-loader - converts stylus to css
// css-loader is processing url() and import from css
// style-loader/vue-style-loader inserts the style into the page

module.exports = {
  test: /\.styl$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: process.env.NODE_ENV === 'development'
      }

    },
    'css-loader',
    'stylus-loader'
  ]
};
