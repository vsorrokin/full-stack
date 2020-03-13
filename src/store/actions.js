export default {
  getCurrentIdentity(context, payload) {
    //if (!context.state.isAuthenticated) return;

    if (payload.fromCache && promises.currentIdentity) return promises.currentIdentity;

    promises.currentIdentity = payload.vue.$UDCAPI.call('/auth/api', {
      command: 'get_current_identity'
    }).then(res => {
      const person = res.data.person;
      person.name = `${person.first_name} ${person.last_name}`

      if (context.state.mode === 'sugar') {
        person.permissions.has_pin = true;
      }

      context.commit('user', person);
      return res;
    }).catch(res => {
      if (getPropValue(res, 'response.status') === 400) {
        EventBus.$emit('logout', {force: true});
      }
      console.log(res);
      context.commit('user', null);
      //throw res;
    });

    return promises.currentIdentity;
  },

  loadAccounts(context, payload) {
    if (!context.state.isAuthenticated) return;
    if (payload.fromCache && promises.accounts) return promises.accounts;

    promises.accounts = payload.vue.$UDCAPI.call('/home/api', {
      command: 'accounts'
    }).then(res => {
      let accounts = res.data.accounts;

      if (context.state.mode === 'sugar') {
        accounts.sugar = {
          ...accounts.sugar,
          coin: true,
          currency_symbol: 's'
        }

        accounts.dollar = {
          ...accounts.dollar,
          coin: false,
          currency_symbol: '$'
        }

        accounts.dollar.name = 'USD';
      }

      context.commit('accounts', accounts);

      return accounts;
    }).catch(e => {
      console.log(e);
    });

    return promises.accounts;
  },

  getLastOperation(context, payload) {
    if (!context.state.isAuthenticated) return;

    if (payload.fromCache && promises.lastOperation) return promises.lastOperation;

    promises.lastOperation = payload.vue.$UDCAPI.call('/home/api', {
      command: 'last_operation'
    }).then(res => {
      context.commit('lastOperation', res.data.last_operation);

      return res.data.last_operation;
    });

    return promises.lastOperation;
  }

};
