const USER_ERROR = Symbol();
const UNKNOWN_ERROR = Symbol();

const ERRORS = {
  'entity_too_large': {type: USER_ERROR, text: 'File is too big'},
  'upload_abort': {type: USER_ERROR, text: 'Upload aborted'},
};

class ErrorHandler {
  constructor(settings) {
    this.vue = settings.vue;

    if (typeof window !== 'undefined') {
      window.ERR = this;
    }

    this.errorTypesToReport = [UNKNOWN_ERROR];
  }

  code(code) {
    return JSON.stringify({code});
  }

  _getErrorInfo(err) {
    const info = {type: UNKNOWN_ERROR, text: err.message};

    try {
      const codeObjJSON = `{${err.message.match(/[^{}]*(?=\})/g)[0].split('\\').join('')}}`;
      const errorInfo = ERRORS[JSON.parse(codeObjJSON).code];

      if (errorInfo.type && errorInfo.text) {
        info.type = errorInfo.type;
        info.text = errorInfo.text;
      }

    } catch(e) {}

    return info;
  }

  log(err) {
    const originalError = err;

    err = this._getErrorInfo(err);

    if (this.errorTypesToReport.includes(err.type)) {
      console.error('Report this error!', originalError);
    }

    return err;
  }

  show(err) {
    err = this.log(err);

    this.vue.$notification.error(err.text);
  }

}

export default ErrorHandler;
