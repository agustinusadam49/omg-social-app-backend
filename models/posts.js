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
            msg: "Status must be 'PUBLIC', 'PRIVATE', or 'FOLLOWERS_ONLY'!",
          },
        },
      },
      postStatus: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Post Status cannot be empty!",
          },
          isIn: {
            args: [["ORIGINAL_POST", "REPOST", "REPOST_QUOTE"]],
            msg: "Post status must be 'ORIGINAL_POST', 'REPOST', or 'REPOST_QUOTE'!",
          },
        },
      },
      repostCounter: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: "repostCounter must be an integer or a number",
          },
        },
      },
    },
    { sequelize }
  );

  Posts.beforeCreate((posts, options) => {
    posts.postLike = 0;
    posts.postDislike = 0;
    posts.repostCounter = 0;
  });

  Posts.associate = function (models) {
    // associations can be defined here
    Posts.belongsTo(models.Users);
    Posts.hasMany(models.Likes);
    Posts.hasMany(models.Comments);
    Posts.hasMany(models.ReplyComments);
    Posts.hasOne(models.RePosts);
  };
  return Posts;
};
