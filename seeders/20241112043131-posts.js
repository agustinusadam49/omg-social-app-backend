"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkUpdate("Posts", { postStatus: "ORIGINAL_POST" }, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Posts", null, {});
  },
};
