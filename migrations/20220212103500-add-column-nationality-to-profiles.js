'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Profiles", "nationality", Sequelize.STRING);

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Profiles", "nationality");
  }
};
