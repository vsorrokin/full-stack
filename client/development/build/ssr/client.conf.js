const webpack = require('webpack');
const merge = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin({disable: true});

const isProd = process.env.NODE_ENV === 'production';

const baseConfig = require(`../spa/${isProd ? 'prod' : 'base'}.conf.js`);

module.exports = smp.wrap(merge(baseConfig, {
  entry: './entry-client.js',

  output: {
    publicPath: GCONFIG.client.publicPath + '/'
  },

  plugins: [
    // Important: this splits the webpack runtime into a leading chunk
    // so that async chunks can be injected right after it.
    // this also enables better caching for your app/vendor code.
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "manifest",
    //   minChunks: Infinity
    // }),
    // This plugins generates `vue-ssr-client-manifest.json` in the
    // output directory.
    new VueSSRClientPlugin()
  ]
}));
