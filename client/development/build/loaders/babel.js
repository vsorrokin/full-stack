module.exports = {
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,

  use: [
    {
      loader: 'cache-loader',
      options: {
        cacheDirectory: './cache/babel_webpack'
      }
    },

    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime'],
        cacheDirectory: './cache/babel'
      }
    }
  ]
};
