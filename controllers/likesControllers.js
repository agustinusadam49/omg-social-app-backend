const { Likes, Posts } = require("../models");

class LikesControllers {
  // Create
  static addLike(req, res, next) {
    const userIdWhoHasThisLike = req.userDataId;
    const postLikeTotalFromBody = 0;
    const newLikeObj = {
      PostId: req.body.PostId,
      UserId: userIdWhoHasThisLike,
    };

    let newLikeCompleteData = null;
    Likes.create(newLikeObj)
      .then((newLikeResponse) => {
        if (newLikeResponse) {
          newLikeCompleteData = newLikeResponse;
          const postIdToUpdate = newLikeCompleteData.PostId;
          const payloadToPostUpdate = {
            postLike: postLikeTotalFromBody,
          };
          return Posts.update(payloadToPostUpdate, {
            where: { id: postIdToUpdate },
          });
        } else if (!newLikeResponse) {
          throw {
            status: "400 Bad Request",
            message: "Failed add like",
            code: 400,
            success: false,
          };
        }
      })
      .then((updatePostLikeResponse) => {
        if (updatePostLikeResponse == 1) {
          res.status(201).json({
            status: "201 Success add like!",
            message: "Success create a new like",
            newLike: newLikeCompleteData,
            code: 201,
            success: true,
          });
        } else if (updatePostLikeResponse == 0) {
          throw {
            status: "400 Bad Requests!",
            message: "failed update postLike data by PostId",
            code: 400,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  // Read
  static getAllLikes(req, res, next) {
    console.log("Get all likes");
  }

  // Read ById
  static getLikeById(req, res, next) {
    console.log("Get a like by id");
  }

  // Update By Id
  static updateLikeById(req, res, next) {
    console.log("Update a like by id");
  }

  // Delete By Id
  static deleteLikeById(req, res, next) {
    const likeId = req.params.id;
    Likes.destroy({ where: { id: likeId } })
      .then((deleteLikeByIdResponse) => {
        if (deleteLikeByIdResponse == 1) {
          res.status(200).json({
            status: "201 Success delete this like",
            message: `Success delete this like with id: ${likeId}!`,
            code: 200,
            success: true,
          });
        } else if (deleteLikeByIdResponse == 0) {
          throw {
            status: "400 Failed to delete this like",
            message: `Failed to delete this like with id: ${likeId}!`,
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

module.exports = LikesControllers;
