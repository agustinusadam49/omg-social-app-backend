'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;
  class Follows extends Model {}
  Follows.init({
    ProfileId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "ProfileId cannot be empty!",
        },
        isInt: {
          args: true,
          msg: "ProfileId must be an integer!",
        },
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "UserId cannot be empty!",
        },
        isInt: {
          args: true,
          msg: "UserId must be an integer!",
        },
      },
    },
  }, { sequelize });
  Follows.associate = function(models) {
    // associations can be defined here
    Follows.belongsTo(models.Users);
    Follows.belongsTo(models.Profiles);
  };
  return Follows;
};