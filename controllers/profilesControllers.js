const { Profiles } = require("../models");

class ProfilesControllers {
  static editProfileById(req, res, next) {
    const profileId = req.params.id;
    const userIdWhoHasThisProfile = req.userDataId;
    const profileReadyToUpdate = {
      avatarUrl: req.body.avatarUrl,
      biodata: req.body.biodata,
      address: req.body.address,
      birthDate: req.body.birthDate,
      status: req.body.status,
      quotes: req.body.quotes,
      phoneNumber: req.body.phoneNumber,
      UserId: userIdWhoHasThisProfile,
      profileCoverUrl: req.body.profileCoverUrl,
      currentCity: req.body.currentCity,
      nationality: req.body.nationality,
      relationship: req.body.relationship,
    };
    Profiles.update(profileReadyToUpdate, { where: { id: profileId } })
      .then((profileUpdateResult) => {
        if (profileUpdateResult == 1) {
          res.status(201).json({
            status: "201 Success Edit Profile By Id",
            message: `Success edit profile with id: ${profileId}!`,
            code: 201,
            success: true,
          });
        } else if (profileUpdateResult == 0) {
          throw {
            status: "404 Not Found!",
            message: `Profile with id: ${profileId} cannot be found!`,
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = ProfilesControllers;
