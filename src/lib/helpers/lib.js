import { EventBus } from '@/plugins/event-bus.js';
import bodyScroll from '@/util/body_scroll';

import isEqual from 'lodash/isEqual';

class Helpers {
  constructor(settings) {
    this.vue = settings.vue;
  }

  loadAccounts(fromCache = false) {
    return this.vue.store.dispatch('loadAccounts', {vue: this.vue, fromCache});
  }

  amount(currencyKey, amount) {
    const symbol = this.currency(currencyKey, 'symbol');
    const shortName = this.currency(currencyKey, 'shortName');

    switch (currencyKey) {
      case 'dollar':
        return `${symbol}${this.vue.$numeral(amount, 'dollar')}`;
      case 'sugar':
        return `${this.vue.$numeral(amount, 'sugar')} ${shortName}`;
    }
  }

  currency(currencyKey, dataKey) {
    const accounts = this.vue.store.state.accounts;
    if (!accounts) return;

    const currency = accounts[currencyKey];

    if (!currency) return;

    if (!dataKey) return currency;
    switch (dataKey) {
      case 'shortName':
        return currency.short_name.toUpperCase();
      case 'symbol':
        return currency.currency_symbol;
      case 'amount':
        return currency.amount;
      case 'name':
        return currency.name.toUpperCase();
      case 'amountString':
        return this.amount(currencyKey, currency.amount);
      case 'account_id':
        return currency.account_id;
    }
  }

  hideModal() {
    EventBus.$emit('hideModal');

    setTimeout(() => {
      this.vue.store.commit('activeModalName', null);
      this.vue.store.commit('modalSettings', {});
    }, 300);

    bodyScroll.resume();
  }

  // Converts "1967-01-16" to "16.01.1967"
  date(str) {
    if (!str) return str;
    const s = str.split('-');
    if (s.length < 3) return str;
    return `${s[2]}.${s[1]}.${s[0]}`;
  }

  go(name, params) {
    const $router = this.vue.store.vueRouter;
    if (this.isRouteActive(name, params)) {
      console.warn('Route is active already');
      return;
    }
    $router.push({name, params});
  }

  isRouteActive(name, params) {
    const route = this.vue.store.vueRouter.currentRoute;
    return isEqual({name: route.name, params: route.params}, {name, params: params || {}});
  }

  async run(settings) {
    const {scope, task, notifications, success} = settings;

    if (scope.isLoading) return;
    scope.isLoading = true;

    scope.notification = scope.$notification.loading(notifications.start);

    let result;

    try {
      result = await task();
    } catch (e) {
      scope.isLoading = false;
      console.error(e);
      scope.notification.updateData({
        text: scope.$notification.getTextHTML(notifications.error, 'error'),
        type: 'error',
        closeByAPIOnly: false
      });
      return;
    }

    scope.isLoading = false;

    scope.notification.updateData({
      text: scope.$notification.getTextHTML('Registration is approved, thank you!', 'check')
    });

    setTimeout(scope.notification.destroy, 2000);

    if (typeof success === 'function') {
      success();
    }

    return result;
  }

  pause(t = 5000) {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, t);
    });
  }

  notify(settings) {
    let {texts, step, self, overlay, errorDuration} = settings;

    if (overlay === undefined) overlay = true;

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

  async getPrivateKey(settings = {}) {
    const {generateNonce, title} = settings;

    // Generate nonce
    if (generateNonce) {
      try {
        await this.$UDCAPI.call('/auth/api', {
          command: 'generate_nonce'
        });
      } catch (e) {
        return;
      }
    }

    // Get encrypted key
    let encryptedKeyResponse;

    try {
      encryptedKeyResponse = await this.vue.$UDCAPI.call('/auth/api', {
        command: 'get_key'
      });
    } catch (e) {
      console.error(e);
      return;
    }

    const encryptedKey = encryptedKeyResponse.data.encrypted_key;

    if (!encryptedKey) return;

    let privateKey;

    try {
      privateKey = await new Promise((resolve, reject) => {
        this.vue.store.commit('showModal', {
          name: 'decryptKey',
          settings: {
            title,
            encryptedKey: encryptedKey,
            onKey: resolve,
            reject
          }
        });
      });
    } catch (e) {
      return;
    }

    return privateKey;
  }
}

export default Helpers;
