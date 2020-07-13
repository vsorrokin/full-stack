const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  test: /\.css/,
  use: [

    isProd ? {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: process.env.NODE_ENV === 'development'
      }

    } : 'style-loader',

    'css-loader',
    'stylus-loader'
  ]
};
