module.exports = {
  test: /\.(eot|ttf|woff|woff2|svg)$/,
  loader: 'file-loader',
  options: {
    outputPath: 'fonts',
    name: '[name].[contenthash].[ext]'
  }
};
