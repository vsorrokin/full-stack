'use strict';
const bcrypt = require('bcrypt');

const credentials = require('../config/credentials');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      first_name : 'Vadim',
      last_name : 'Sorokin',
      email : credentials.admin.email,
      password : bcrypt.hashSync(credentials.admin.password, 10)
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', [{
      email: credentials.admin.email
    }]);
  }
};
