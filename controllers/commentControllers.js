const { Comments, Users, Profiles } = require("../models");

class CommentController {
  static createNewComment(req, res, next) {
    const currentUserId = req.userDataId;
    const payloadFromRequestBody = {
      PostId: req.body.postId,
      UserId: currentUserId,
      commentContent: req.body.commentContent,
    };
    Comments.create(payloadFromRequestBody)
      .then((newCommentData) => {
        if (newCommentData) {
          res.status(201).json({
            status: "201 Success create new comment",
            message: `Success Create New Comment belongs to user with id: ${currentUserId}`,
            newComment: newCommentData,
            code: 201,
            success: true,
          });
        } else if (!newCommentData) {
          throw {
            status: "400 Bad Request!",
            message: `Failed create new comment belongs to user with id: ${currentUserId}`,
            code: 400,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getAllComments(req, res, next) {
    Comments.findAll({
      include: {
        model: Users,
        include: { model: Profiles },
      },
      order: [["id", "DESC"]],
    })
      .then((comments) => {
        if (comments.length > 0) {
          res.status(200).json({
            status: "200 Get All Comments",
            message: "Successs get all comments",
            commentsData: comments,
            totalComments: comments.length,
            code: 200,
            success: true,
          });
        } else if (comments.length < 1) {
          throw {
            status: "404 Not Found!",
            message: "There are no any comments right now",
            totalComments: comments.length,
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getCommentById(req, res, next) {
    const commentId = req.params.id;
    Comments.findByPk(commentId)
      .then((commentDataById) => {
        if (commentDataById) {
          res.status(200).json({
            status: "200 Success get comment by id",
            message: `Success get comment by id: ${commentId}`,
            comment: commentDataById,
            code: 200,
            success: true,
          });
        } else if (!commentDataById) {
          throw {
            status: "404 Not Found!",
            message: `Sorry comment data with id: ${commentId} cannot be found in DB!`,
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getCommentByPostId(req, res, next) {
    const postId = req.params.PostId;
    Comments.findAll({
      where: { PostId: postId },
      include: {
        model: Users,
        include: {
          model: Profiles,
        },
      },
      order: [["id", "DESC"]],
    })
      .then((commentsByPostId) => {
        if (commentsByPostId.length) {
          res.status(200).json({
            status: "200 Get All Comments Data By PostId",
            message: "Successs get all comments data by postId",
            commentsDataByPostId: commentsByPostId,
            post_id: parseInt(postId),
            totalCommentsByPostId: commentsByPostId.length,
            code: 200,
            success: true,
          });
        } else if (!commentsByPostId.length) {
          res.json({
            status: "404 Not Found!",
            message: "There are no any comments by post id right now",
            totalComments: commentsByPostId.length,
            totalCommentsByPostId: commentsByPostId.length,
            code: 404,
            success: false,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static updateCommentById(req, res, next) {
    const currentUserId = req.userDataId;
    const commentId = req.params.id;
    const requestBodyPayload = {
      PostId: req.body.postId,
      UserId: currentUserId,
      commentContent: req.body.commentContent,
    };

    Comments.update(requestBodyPayload, {
      where: { id: commentId },
    })
      .then((responseUpdateCommentById) => {
        if (responseUpdateCommentById == 1) {
          res.status(201).json({
            status: "201 success edit Comment By Id",
            message: `Success edit comment with id: ${commentId}!`,
            code: 201,
            success: true,
          });
        } else if (responseUpdateCommentById == 0) {
          throw {
            status: "404 Not Found!",
            message: `Comment data with id: ${commentId} cannot be found in DB!`,
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteCommentById(req, res, next) {
    const commentId = req.params.id;
    Comments.destroy({
      where: { id: commentId },
    })
      .then((responseDeleteCommentById) => {
        if (responseDeleteCommentById == 1) {
          res.status(200).json({
            status: "201 Success delete this comment!",
            message: `Success delete this comment data with id: ${commentId}!`,
            code: 200,
            success: true,
          });
        } else if (responseDeleteCommentById == 0) {
          throw {
            status: "400 Failed to delete this comment!",
            message: `Failed to delete this post with id: ${commentId}!`,
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

module.exports = CommentController;
