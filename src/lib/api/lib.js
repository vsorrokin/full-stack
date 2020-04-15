import config from '@/../config/main';
import setProp from 'lodash/set';

class API {
  constructor(settings) {
    this.vue = settings.vue;
  }

  _getOptions() {
    const options = {};

    if (this.vue.store.state.token) {
      options.headers = {
        Authorization: `Bearer ${this.vue.store.state.token}`
      };
    }

    return options;
  }

  upload(settings) {
    const {type, file, onUploadProgress} = settings;

    const formData = new FormData();
    formData.append("file", file);

    const requestOptions = this._getOptions();
    setProp(requestOptions, "headers['Content-Type']", 'multipart/form-data');
    requestOptions.onUploadProgress = onUploadProgress;
    const cancelTokenSource = this.vue.$http.CancelToken.source();
    requestOptions.cancelToken = cancelTokenSource.token;

    const promise = this.vue.$http.post(this.getURL(`upload/${type}`), formData, requestOptions);

    return {
      promise,
      cancel: cancelTokenSource.cancel
    };
  }

  static getURL(endpoint) {
    return `${config.API.root}/v1/${endpoint}`;
  }

  getURL() {
    return API.getURL(...arguments);
  }

  post(endpoint, data) {
    return this.vue.$http.post(this.getURL(endpoint), data, this._getOptions());
  }
}

export default API;
