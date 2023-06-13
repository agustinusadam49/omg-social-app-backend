"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Posts extends Model {}

  Posts.init(
    {
      postCaption: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Caption cannot be empty!",
          },
        },
      },
      postImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postLike: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: "Like data must be an integer or a number",
          },
        },
      },
      postDislike: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: "Dislike data must be an integer or a number",
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
      status: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Status cannot be empty!",
          },
          isIn: {
            args: [["PUBLIC", "PRIVATE", "FOLLOWERS_ONLY"]],
            msg: "Status must be 'PUBLIC', 'PRIVE', or 'FOLLOWERS_ONLY'!"
          }
        },
      }
    },
    { sequelize }
  );

  Posts.associate = function (models) {
    // associations can be defined here
    Posts.belongsTo(models.Users);
    Posts.hasMany(models.Likes);
    Posts.hasMany(models.Comments);
    Posts.hasMany(models.ReplyComments);
  };
  return Posts;
};
