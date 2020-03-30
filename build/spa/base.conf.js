const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const loaders = require('../loaders');

const context = path.resolve('./src');

module.exports = {
  mode: 'development',

  context,

  entry: './entry-client.js',

  resolve: {
    extensions: ['.js', '.vue', '.styl'],
    alias: {
      '@': context,
      '#c': path.resolve(context, 'components'),
      '#p': path.resolve(context, 'components/pages')
    }
  },

  module: {
    rules: [
      loaders.babel,
      loaders.stylus,
      loaders.vue,
      loaders.pug,
      loaders.font,
      loaders.image
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({template: 'index.html'}),
    new VueLoaderPlugin()
  ]
};
