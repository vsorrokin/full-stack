const path = require('path');

module.exports = {
  test: /\.vue$/,
  use: [
    'vue-loader',
    path.resolve('build/loaders/vue_preprocess.js')
  ]
};
