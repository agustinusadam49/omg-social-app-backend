const { RePosts } = require("../models");

class RepostController {
  static createRepost(req, res, next) {
    const currentUserId = req.userDataId;

    const { PostId, sourcePostId } = req.body;

    const payload = {
      PostId: PostId,
      UserId: currentUserId,
      sourcePostId: sourcePostId,
    };

    RePosts.create(payload)
      .then((newRepostData) => {
        if (newRepostData) {
          res.status(201).json({
            status: "201 Success create new repost",
            message: `Success Create New Repost belongs to user with id: ${currentUserId}`,
            repost: newRepostData,
            code: 201,
            success: true,
          });
        } else if (!newRepostData) {
          throw {
            status: "400 Bad Request!",
            message: `Failed create new Repost belongs to user with id: ${currentUserId}`,
            code: 400,
            success: false,
          };
        }
      })
      .catch((err) => next(err));
  }
}

module.exports = RepostController;
