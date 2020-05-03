const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// stylus-loader - converts stylus to css
// css-loader is processing url() and import from css
// style-loader/vue-style-loader inserts the style into the page

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  test: /\.styl$/,
  use: [

    isProd ? {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: process.env.NODE_ENV === 'development'
      }

    } : 'vue-style-loader',
    
    'css-loader',
    'stylus-loader'
  ]
};
