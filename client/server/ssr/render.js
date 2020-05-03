const createProdRenderer = require('./prod.renderer');
const DevRenderer  = require('./dev.renderer');

class Render {
  constructor(settings) {
    this.settings = settings;
  }

  async init() {
    this.renderer = await this.initRenderer();
  }

  initRenderer() {
    if (this.settings.isProd) {
      return createProdRenderer(this.settings);
    }

    const devRenderer = new DevRenderer({
      ...this.settings,
      cb: (renderer) => {
        this.renderer = renderer;
      }
    });

    return devRenderer.create();
  }

  handleError(err) {
    if (err.url) {
      this.res.redirect(err.url)
    } else if(err.code === 404) {
      this.res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      this.res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${this.req.url}`)
      console.error(err.stack)
    }
  }

  start(req, res) {
    this.req = req;
    this.res = res;

    const s = Date.now()

    res.setHeader("Content-Type", "text/html")

    const context = {
      title: 'Vue HN 2.0', // default title
      url: req.url
    }

    this.renderer.renderToString(context, (err, html) => {
      if (err) {
        return this.handleError(err)
      }

      res.send(html)

      if (!this.settings.isProd) {
        console.log(`whole request: ${Date.now() - s}ms`)
      }
    })
  }
}

module.exports = Render;
