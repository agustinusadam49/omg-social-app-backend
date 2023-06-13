const { Users, Profiles, Follows } = require("../models");

function checkCurrentUserFollowing(req, res, next) {
  const currentUserLoginId = req.userDataId;
  let finalFollowingData = null;
  Follows.findAll({
    include: [
      { model: Users, include: { model: Profiles } },
      { model: Profiles, include: { model: Users } },
    ],
    order: [["id", "DESC"]],
  })
    .then((followData) => {
      if (followData.length > 0) {
        const currentUserFollowingFiltered = followData.filter(
          (item) => item.UserId === currentUserLoginId
        );
        finalFollowingData = currentUserFollowingFiltered.map(
          (item) => item.ProfileId
        );
      } else if (followData.length < 1) {
        finalFollowingData = [];
      }

      req.finalFollowData = finalFollowingData;
      next();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  checkCurrentUserFollowing,
};
