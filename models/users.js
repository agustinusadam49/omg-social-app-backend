"use strict";
const { generatePassword } = require("../helpers/bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Users extends Model {
    greeting() {
      return `Hai ${this.userFullname}, bagaimana kabar anda?`;
    }
  }

  Users.init(
    {
      userFullname: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Fullname harus diisi!",
          },
        },
      },
      userName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Username harus diisi!",
          },
        },
      },
      userEmail: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "User Email harus diisi!",
          },
          isEmail: {
            msg: "Email tidak valid!",
          },
        },
      },
      userPassword: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Password harus diisi!",
          },
        },
      },
      userOnlineStatus: DataTypes.BOOLEAN,
      emailVerified: DataTypes.BOOLEAN,
    },
    { sequelize }
  );

  Users.beforeCreate((users, options) => {
    users.userPassword = generatePassword(users.userPassword);
    users.userOnlineStatus = true;
    users.emailVerified = false;
  });

  Users.associate = function (models) {
    // associations can be defined here
    Users.hasOne(models.Profiles);
    Users.hasMany(models.Posts);
    Users.hasMany(models.Likes);
    Users.hasMany(models.Comments);
    Users.hasMany(models.ReplyComments);
    Users.hasMany(models.Messages);
    Users.hasMany(models.Follows);
  };
  return Users;
};
