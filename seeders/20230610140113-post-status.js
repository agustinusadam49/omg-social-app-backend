"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkUpdate("Posts", { status: "PUBLIC" }, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Posts", null, {});
  }
};
