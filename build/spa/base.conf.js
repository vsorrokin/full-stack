const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const buildConfig = require('../../config/build');

const loaders = require('../loaders');

const context = path.resolve('./src');

module.exports = {
  mode: 'development',

  context,

  entry: './app.js',

  output: {
    publicPath: buildConfig.publicPath + '/'
  },

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
      loaders.font
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({template: 'index.html'}),
    new VueLoaderPlugin()
  ]
};
