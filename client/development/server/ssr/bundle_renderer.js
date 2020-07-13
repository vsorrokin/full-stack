const LRU = require('lru-cache');
const { createBundleRenderer } = require('vue-server-renderer');

module.exports = function(bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    // cache: new LRU({
    //   max: 1000,
    //   maxAge: 1000 * 60 * 15
    // }),
    // this is only needed when vue-server-renderer is npm-linked
    //basedir: resolve('dist'),
    // recommended for performance
    runInNewContext: false,
    inject: false
  }));
}
