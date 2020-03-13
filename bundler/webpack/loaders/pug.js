// Why not pug-loader? Because pug-loader resturns NOT HTML but compiled template function
// pug-plain-loader returns HTML

module.exports = {
  test: /\.(pug|jade)$/,
  loader: 'pug-plain-loader'
};
