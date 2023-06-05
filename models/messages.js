"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Messages extends Model {}

  Messages.init(
    {
      receiver_id: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "receiver_id cannot be empty!",
          },
          isInt: {
            msg: "receiver_id data must be an integer or a number!",
          },
        },
      },
      message_text: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "message_text data cannot be empty!",
          },
        },
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        validate: {
          notEmpty: {
            msg: "isRead data cannot be empty!",
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
            msg: "UserId data must be an integer or a number!",
          },
        },
      },
    },
    { sequelize }
  );
  Messages.associate = function (models) {
    // associations can be defined here
    Messages.belongsTo(models.Users);
  };
  return Messages;
};
