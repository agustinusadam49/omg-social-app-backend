const { ReplyComments, Users, Profiles } = require("../models");

class ReplyCommentsControllers {
  static createNewReplyComments(req, res, next) {
    const currentUserId = req.userDataId;
    const reqBodyReply = {
      PostId: req.body.PostId,
      UserId: currentUserId,
      CommentId: req.body.CommentId,
      replyMessage: req.body.replyMessage,
    };

    ReplyComments.create(reqBodyReply)
      .then((replyCommentResponse) => {
        if (replyCommentResponse) {
          res.status(201).json({
            status: "201 Success create new reply comment",
            message: `Success Create New Reply Comment belongs to user with id: ${currentUserId}`,
            newReplyComments: replyCommentResponse,
            code: 201,
            success: true,
          });
        } else if (!replyCommentResponse) {
          throw {
            status: "400 Bad Request!",
            message: `Failed create new reply comment belongs to user with id: ${currentUserId}`,
            code: 400,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getReplyCommentsByCommentId(req, res, next) {
    const commentId = req.params.CommentId;
    ReplyComments.findAll({
      where: { CommentId: commentId },
      include: {
        model: Users,
        include: {
          model: Profiles,
        },
      },
      order: [["id", "DESC"]],
    })
      .then((replyByCommentId) => {
        if (replyByCommentId.length) {
          res.status(200).json({
            status: "200 Get All Reply Comments Data By CommentId",
            message: "Successs get all reply comments data by CommentId",
            replyCommentsByCommentId: replyByCommentId,
            comment_id: parseInt(commentId),
            totalReplyCommentsByCommentId: replyByCommentId.length,
            code: 200,
            success: true,
          });
        } else if (!replyByCommentId.length) {
          res.json({
            status: "404 Not Found!",
            message: "There are no any reply comments by comment id right now",
            totalReplyCommentsByCommentId: replyByCommentId.length,
            code: 404,
            success: false,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = ReplyCommentsControllers;
