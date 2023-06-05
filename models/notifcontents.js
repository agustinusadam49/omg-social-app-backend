"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class NotifContents extends Model {}

  NotifContents.init(
    {
      sender_id: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "sender_id cannot be empty!",
          },
          isInt: {
            msg: "sender_id data must be an integer or a number!",
          },
        },
      },
      sender_name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "sender_name cannot be empty!",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "description cannot be empty!",
          },
        },
      },
      source_id: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "source_id cannot be empty!",
          },
          isInt: {
            msg: "source_id data must be an integer or a number!",
          },
        },
      },
      NotificationId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "NotificationId cannot be empty!",
          },
          isInt: {
            msg: "NotificationId data must be an integer or a number!",
          },
        },
      },
    },
    { sequelize }
  );

  NotifContents.associate = function (models) {
    // associations can be defined here
    NotifContents.belongsTo(models.Notifications);
  };
  return NotifContents;
};
