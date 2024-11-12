"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkUpdate("Posts", { repostCounter: 0 }, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Posts", null, {});
  },
};
