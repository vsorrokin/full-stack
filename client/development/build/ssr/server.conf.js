const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin({disable: true});

const isProd = process.env.NODE_ENV === 'production';

const baseConfig = require(`../spa/${isProd ? 'prod' : 'base'}.conf.js`);

module.exports = smp.wrap(merge(baseConfig, {
  entry: './entry-server.js',
  target: 'node',
  devtool: 'source-map',

  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
    publicPath: GCONFIG.client.publicPath + '/'
  },

  externals: nodeExternals({
    whitelist: /\.css$/
  }),

  plugins: [
    new VueSSRServerPlugin()
  ]
}));
