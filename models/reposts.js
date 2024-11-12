"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class RePosts extends Model {}

  RePosts.init(
    {
      PostId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "PostId data cannot be empty!",
          },
          isInt: {
            msg: "PostId must be an integer or a number",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "UserId data cannot be empty!",
          },
          isInt: {
            msg: "UserId must be an integer or a number",
          },
        },
      },
      sourcePostId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "sourcePostId data cannot be empty!",
          },
          isInt: {
            msg: "sourcePostId must be an integer or a number",
          },
        },
      },
    },
    {
      sequelize,
    }
  );

  RePosts.associate = function (models) {
    RePosts.belongsTo(models.Posts);
    RePosts.belongsTo(models.Users);
  };

  return RePosts;
};
