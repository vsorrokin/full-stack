const path = require('path');

module.exports = {
  test: /\.vue$/,
  use: [
    'vue-loader',
    path.resolve('development/build/loaders/vue_preprocess.js')
  ]
};
