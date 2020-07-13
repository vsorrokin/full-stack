const DevServer = require('../../build/ssr/server');
const createRenderer = require('./bundle_renderer');

class DevRenderer {
  constructor(settings) {
    this.settings = settings;
  }

  create() {
    return new Promise((resolve, reject) => {
      // In development: setup the dev server with watch and hot-reload,
      // and create a new renderer on bundle / index template update.
      new DevServer({
        ...this.settings,
        cb: (bundle, options) => {
          const renderer = createRenderer(bundle, options);
          resolve(renderer);
          this.settings.cb(renderer);
        }
      });
    });
  }
}

module.exports = DevRenderer;
