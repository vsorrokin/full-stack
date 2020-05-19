import getPropValue from 'lodash/get';

class Helpers {
  constructor(settings) {
    this.vue = settings.vue;
  }

  _notifyError(settings) {
    const {err, msg, scope} = settings;

    console.error(err);

    const errorCode = getPropValue(err, 'response.data.data.code');
    const errorMessage = getPropValue(err, 'message');

    if (!errorCode && !errorMessage) {
      this.notify({texts: msg, step: 'error', self: scope});
      scope.isLoading = false;
      scope.notification = null;
      return;
    }

    let text = null;
    switch (errorCode) {
      case 'incorrect_login_credentials':
        text = 'Invalid login data';
        break;
    }

    if (!text && errorMessage) {
      text = errorMessage;
    }

    msg[`error${errorCode}`] = text;


    this.notify({texts: msg, step: `error${errorCode}`, self: scope});
    scope.isLoading = false;
    scope.notification = null;
  }

  async run(settings) {
    // Settings
    let {scope, endpoint, data, msg, method} = settings;
    if (!method) method = 'post';

    // Set loading status
    if (scope.isLoading) return;
    scope.isLoading = true;

    // Show start notification
    this.notify({texts: msg, step: 'start', self: scope, overlay: false, errorDuration: 2000});

    let result;
    try {
      result = await this.vue.$API[method](endpoint, data);
    } catch (err) {
      this._notifyError({err, msg, scope});
      return;
    }

    this.notify({texts: msg, step: 'success', self: scope, overlay: false, errorDuration: 2000});
    scope.isLoading = false;
    scope.notification = null;

    return result.data.data;
  }

  notify(settings) {
    let {texts, step, self, overlay = false, errorDuration = 2000} = settings;

    const text = texts[step];

    if (!self.notification) {
      self.notification = self.$notification.loading(text, overlay);
      return;
    }

    if (step.indexOf('success') === 0) {
      self.notification.updateData({
        text: self.$notification.getTextHTML(text, 'check')
      });
      setTimeout(self.notification.destroy, 2000);
      return;
    }

    if (step.indexOf('error') === 0) {
      self.notification.updateData({
        text: self.$notification.getTextHTML(text, 'error'),
        type: 'error',
        closeByAPIOnly: false
      });

      if (errorDuration) {
        setTimeout(self.notification.destroy, errorDuration);
      }
      return;
    }

    self.notification.updateData({
      text: self.$notification.getTextHTML(text, 'spinner')
    });
  }
}

export default Helpers;
