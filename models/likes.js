"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Likes extends Model {}

  Likes.init(
    {
      PostId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "PostId cannot be empty!",
          },
          isInt: {
            args: true,
            msg: "PostId must be an integer!",
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
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      idDelete: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    { sequelize }
  );

  Likes.associate = function (models) {
    // associations can be defined here
    Likes.belongsTo(models.Users);
    Likes.belongsTo(models.Posts);
  };

  return Likes;
};
