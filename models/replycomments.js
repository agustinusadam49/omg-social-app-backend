"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class ReplyComments extends Model {}

  ReplyComments.init(
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
      CommentId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "CommentId cannot be empty!",
          },
          isInt: {
            msg: "CommentId data must be an integer or a number!",
          },
        },
      },
      replyMessage: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "replyMessage data cannot be empty!",
          },
        },
      },
    },
    { sequelize }
  );
  ReplyComments.associate = function (models) {
    // associations can be defined here
    ReplyComments.belongsTo(models.Posts);
    ReplyComments.belongsTo(models.Users);
    ReplyComments.belongsTo(models.Comments);
  };
  return ReplyComments;
};
