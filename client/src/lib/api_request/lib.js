import setProp from 'lodash/set';

class APIRequest {
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
    return `${GCONFIG.API.host}:${GCONFIG.API.port}/v1/${endpoint}`;
  }

  getURL() {
    return APIRequest.getURL(...arguments);
  }

  post(endpoint, data) {
    return this.vue.$http.post(this.getURL(endpoint), data, this._getOptions());
  }

  async run({scope, endpoint, data, msg, method = 'post'}) {
    // Set loading status
    if (scope.isLoading) return;
    scope.isLoading = true;

    // Show start notification
    this.vue.$helpers.notify({texts: msg, step: 'start', self: scope});

    let result;
    try {
      result = await this.vue.$APIRequest[method](endpoint, data);
    } catch (err) {
      this.vue.$helpers.notifyError({err, msg, scope});
      return;
    }

    this.vue.$helpers.notify({texts: msg, step: 'success', self: scope});
    scope.isLoading = false;
    scope.notification = null;

    return result.data.data;
  }
}

export default APIRequest;
