const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const loaders = require('./loaders');

const context = path.resolve('./src');

module.exports = {
  context,

  entry: {
    main: './index.js'
  },

  resolve: {
    extensions: ['.js', '.vue', '.styl'],
    alias: {
      '@': context
    }
  },

  module: {
    rules: [
      loaders.babel,
      loaders.stylus,
      loaders.vue,
      loaders.pug,
      loaders.font
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({template: 'index.html'}),
    new VueLoaderPlugin()
  ]
};
