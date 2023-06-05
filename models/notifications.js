"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Notifications extends Model {}

  Notifications.init(
    {
      type: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "type cannot be empty!",
          },
        },
      },
      notifImageUrl: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "notifImageUrl cannot be empty!",
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

  Notifications.beforeCreate((notifications, options) => {
    if (notifications.type === 'Posts') {
      notifications.notifImageUrl = "https://ps.w.org/ultimate-post-list/assets/icon-256x256.png?rev=2478520"
    }

    if (notifications.type === 'Messages') {
      notifications.notifImageUrl = "https://media.istockphoto.com/vectors/new-notification-email-notification-flat-banner-incoming-message-vector-id1271748745?s=612x612"
    }
    
    if (notifications.type === 'Follows') {
      notifications.notifImageUrl = "https://media.istockphoto.com/vectors/add-user-icon-vector-id1020933042?s=612x612"
    }

    if (notifications.type === 'Comments') {
      notifications.notifImageUrl = "https://cdn1.iconfinder.com/data/icons/flat-and-simple-part-1/128/round_comment_notification-512.png"
    }

    if (notifications.type === 'Likes') {
      notifications.notifImageUrl = "https://i.pinimg.com/originals/45/da/55/45da5509abb6dc89c0369b9379c7ac4c.jpg"
    }

    notifications.isRead = false
  });
  
  Notifications.associate = function (models) {
    // associations can be defined here
    Notifications.belongsTo(models.Users)
    Notifications.hasOne(models.NotifContents)
  };
  return Notifications;
};
