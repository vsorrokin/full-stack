'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Files', 'options', Sequelize.JSONB);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Files', 'options');
  }
};
