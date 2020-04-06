import config from '@/../config/main';

class API {
  constructor(settings) {
    this.vue = settings.vue;
  }

  getURL(endpoint) {
    return `${config.API.root}/v1/${endpoint}`;
  }

  post(endpoint, data) {
    return this.vue.$http.post(this.getURL(endpoint), data);
  }
}

export default API;
