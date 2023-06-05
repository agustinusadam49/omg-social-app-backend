const {
  Follows,
  Users,
  Profiles,
} = require("../models");

class FollowControllers {
  static createFollow(req, res, next) {
    const currentUserId = req.userDataId;
    const profileId = req.body.ProfileId
    const payloadFromRequestBody = {
      ProfileId: profileId,
      UserId: currentUserId,
    };

    Follows.create(payloadFromRequestBody)
      .then((newFollowData) => {
        if (newFollowData) {
          res.status(201).json({
            status: "201 Success create new follow",
            message: `Success Create New Follow belongs to user with id: ${currentUserId}`,
            newFollow: newFollowData,
            code: 201,
            success: true,
          });
        } else if (!newFollowData) {
          throw {
            status: "400 Bad Request!",
            message: `Failed create new follow belongs to user with id: ${currentUserId}`,
            code: 400,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static readAllFollows(req, res, next) {
    Follows.findAll({
      include: [
        { model: Users, include: { model: Profiles } },
        { model: Profiles, include: { model: Users } },
      ],
      order: [["id", "DESC"]],
    })
      .then((follows) => {
        if (follows.length > 0) {
          res.status(200).json({
            status: "200 Get All Follows",
            message: "Successs get all Follows",
            followsData: follows,
            totalFollows: follows.length,
            code: 200,
            success: true,
          });
        } else if (follows.length < 1) {
          throw {
            status: "404 Not Found!",
            message: "There are no any follows right now",
            totalFollows: follows.length,
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static readAllFollowerOfCurrentUser(req, res, next) {
    const currentUserId = req.userDataId;
    Follows.findAll({
      include: [
        { model: Users, include: { model: Profiles } },
        { model: Profiles, include: { model: Users } },
      ],
      order: [["id", "DESC"]],
    })
      .then((follows) => {
        if (follows.length > 0) {
          res.status(200).json({
            status: "200 Get All Follows",
            message: "Successs get all Follows",
            follower: follows.filter(
              (item) => item.Profile.UserId === currentUserId
            ),
            followerTotal: follows.filter(
              (item) => item.Profile.UserId === currentUserId
            ).length,
            code: 200,
            success: true,
          });
        } else if (follows.length < 1) {
          throw {
            status: "404 Not Found!",
            message: "There are no any follows right now",
            totalFollows: follows.length,
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static readAllFollowingOfCurrentUser(req, res, next) {
    const currentUserId = req.userDataId;
    Follows.findAll({
      include: [
        { model: Users, include: { model: Profiles } },
        { model: Profiles, include: { model: Users } },
      ],
      order: [["id", "DESC"]],
    })
      .then((follows) => {
        if (follows.length > 0) {
          res.status(200).json({
            status: "200 Get All Follows",
            message: "Successs get all Follows",
            following: follows.filter((item) => item.User.id === currentUserId),
            followingotal: follows.filter(
              (item) => item.User.id === currentUserId
            ).length,
            code: 200,
            success: true,
          });
        } else if (follows.length < 1) {
          throw {
            status: "404 Not Found!",
            message: "There are no any follows right now",
            totalFollows: follows.length,
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static readFollowById(req, res, next) {
    console.log("Read follow by id");
  }

  static updateFollowById(req, res, next) {
    console.log("Update follow by id");
  }

  static deleteFollowById(req, res, next) {
    const followId = req.params.id;
    Follows.destroy({ where: { id: followId } })
      .then((deleteFollowById) => {
        if (deleteFollowById == 1) {
          res.status(200).json({
            status: "201 Success delete this follow",
            message: `Success delete this follow with id: ${followId}!`,
            code: 200,
            success: true,
          });
        } else if (deleteFollowById == 0) {
          throw {
            status: "400 Failed to delete this follow",
            message: `Failed to delete this follow with id: ${followId}!`,
            code: 400,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = FollowControllers;
