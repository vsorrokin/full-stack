import Vue from 'vue';
import Notifications from 'vue-notification'
import velocity      from 'velocity-animate'

Vue.use(Notifications, { velocity })

let notifications = [];

Vue.use(function(Vue) {
  Object.defineProperties(Vue.prototype, {
    '$notification': {
      get() {
        return {
          destroyAll() {
            notifications.forEach(ntf => ntf.destroy());
            notifications = [];
          },

          show: (data) => {
            const notification = {};

            this.$notify({
              ...data,
              notification
            });

            notifications.push(notification.control);

            return notification.control;
          },

          getTextHTML: (text, icon) => {
            return `<div class="icon-wrapper">
                      <i class="icon-${icon}"></i>
                    </div>
                    <span>${text}</span>
                    <i class="icon-close"></i>`;
          },

          loading: (text, overlay = true) => {
            return this.$notification.show({
              text: this.$notification.getTextHTML(text, 'spinner'),
              type: 'waiting',
              duration: -1,
              closeByAPIOnly: true,
              overlay
            });
          },

          preloader: (settings) => {
            const notification = this.$notification.loading(settings.loadingText);

            const promiseStartedTime = +new Date();
            const minLoadingTime = 0;

            settings.promise.then(() => {
              const promiseExecutionTimeMs = +new Date() - promiseStartedTime;
              const timeout = promiseExecutionTimeMs < minLoadingTime ? minLoadingTime - promiseExecutionTimeMs : 0;

              if (!settings.finalData) {
                notification.destroy();
                return;
              }

              setTimeout(() => {
                notification.updateData(settings.finalData);
                setTimeout(notification.destroy, 1000);
              }, timeout);

            }).catch(() => {
              notification.destroy();
            });
          },

          success: (title, label = 'Success') => {
            return this.$notification.show({
              title,
              text: this.$notification.getTextHTML(label, 'check'),
              type: 'success',
              duration: 5000
            });
          },

          error: (text, keep, closeByAPIOnly = false) => {
            return this.$notification.show({
              text: this.$notification.getTextHTML(text, 'error'),
              type: 'error',
              overlay: false,
              closeByAPIOnly,
              duration: 2000
            });
          }
        }
      }
    }
  });
});

export default {}
