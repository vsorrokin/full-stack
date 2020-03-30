module.exports = {
  test: /\.(jpg|png|gif)$/,
  loader: 'file-loader',
  options: {
    outputPath: 'images',
    name: '[name].[contenthash].[ext]'
  }
};
