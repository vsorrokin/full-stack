const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.conf.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = merge(baseConfig, {
  mode: 'development',

  devServer: {
    disableHostCheck: true,
    //bonjour: true, //allow to open server in all localhost devices
    host: '0.0.0.0', // If you want your server to be accessible externally then use '0.0.0.0'
    historyApiFallback: true,
    hot: true,
    https: {
      key: fs.readFileSync(path.resolve('./ssl/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve('./ssl/localhost.pem'))
    },
    overlay: {
      warnings: true,
      errors: true
    },
    open: true,
    contentBase: path.resolve('./public')
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new DashboardPlugin()
  ]
});
