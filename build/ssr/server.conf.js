const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const isProd = process.env.NODE_ENV === 'production';

const baseConfig = require(`../spa/${isProd ? 'prod' : 'base'}.conf.js`);

const buildConfig = require('../../config/build');

module.exports = merge(baseConfig, {
  entry: './entry-server.js',
  target: 'node',
  devtool: 'source-map',

  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
    publicPath: buildConfig.publicPath + '/'
  },

  externals: nodeExternals({
    whitelist: /\.css$/
  }),

  plugins: [
    new VueSSRServerPlugin()
  ]
});
