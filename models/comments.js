"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Comments extends Model {}

  Comments.init(
    {
      PostId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "PostId data cannot be empty!",
          },
          isInt: {
            msg: "PostId data must be an integer or a number!",
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
      commentContent: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Comment data cannot be empty!",
          },
        },
      },
    },
    { sequelize }
  );

  Comments.associate = function (models) {
    // associations can be defined here
    Comments.belongsTo(models.Users);
    Comments.belongsTo(models.Posts);
    Comments.hasMany(models.ReplyComments);
  };
  return Comments;
};
