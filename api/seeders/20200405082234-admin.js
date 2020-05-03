'use strict';
const bcrypt = require('bcrypt');

const GSECRET = require('../secret/credentials.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      first_name : 'Vadim',
      last_name : 'Sorokin',
      email : GSECRET.admin.email,
      password : bcrypt.hashSync(GSECRET.admin.password, 10)
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', [{
      email: GSECRET.admin.email
    }]);
  }
};
