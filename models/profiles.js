"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;

  class Profiles extends Model {}

  Profiles.init(
    {
      avatarUrl: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "avatarUrl cannot be empty!",
          },
        },
      },
      biodata: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quotes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      UserId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: "UserId cannot be empty!",
          },
          isInt: {
            msg: "UserId must be an integer or a number!",
          },
        },
      },
      profileCoverUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currentCity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      relationship: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { sequelize }
  );

  Profiles.beforeCreate((profiles, options) => {
    profiles.avatarUrl =
      "https://www.pngarts.com/files/11/Avatar-PNG-Transparent-Image.png";
    profiles.profileCoverUrl =
      "https://png.pngtree.com/thumb_back/fh260/back_our/20190619/ourmid/pngtree-company-profile-corporate-culture-exhibition-board-display-poster-material-image_131622.jpg";
  });

  Profiles.associate = function (models) {
    // associations can be defined here
    Profiles.belongsTo(models.Users);
    Profiles.hasMany(models.Follows);
  };

  return Profiles;
};
