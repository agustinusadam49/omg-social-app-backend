const { Posts, Likes, Comments, Messages } = require("../models");

function authorizationPost(req, res, next) {
  const postId = req.params.id;
  Posts.findByPk(postId)
    .then((postDataById) => {
      if (postDataById) {
        if (postDataById.UserId === req.userDataId) {
          next();
        } else {
          throw {
            status: "401 Unauthorized!",
            message: `Maaf data post dengan ID: ${postId} bukan milik Anda!`,
            code: 401,
          };
        }
      } else if (!postDataById) {
        throw {
          status: "404 Not Found!",
          message: `Maaf data post ${
            postId ? "dengan ID: " + postId : ""
          } tidak dapat ditemukan`,
          code: 404,
        };
      }
    })
    .catch((err) => {
      next(err);
    });
}

function authorizationLikes(req, res, next) {
  const likeId = req.params.id;
  Likes.findByPk(likeId)
    .then((likeDataById) => {
      if (likeDataById) {
        if (likeDataById.UserId === req.userDataId) {
          next();
        } else {
          throw {
            status: "401 Unauthorized!",
            message: `Maaf data like dengan ID: ${likeId} bukan milik Anda!`,
            code: 401,
          };
        }
      } else if (!likeDataById) {
        throw {
          status: "404 Not Found!",
          message: `Maaf data like dengan ID: ${likeId} tidak dapat ditemukan!`,
          code: 404,
        };
      }
    })
    .catch((err) => {
      next(err);
    });
}

function authorizationComments(req, res, next) {
  const commentId = req.params.id;
  Comments.findByPk(commentId)
    .then((commentDataById) => {
      if (commentDataById) {
        if (commentDataById.UserId == req.userDataId) {
          next();
        } else {
          throw {
            status: "401 Unauthorized!",
            message: `Maaf data comment dengan id: ${commentId} bukanlah milik Anda!`,
            code: 401,
            success: false,
          };
        }
      } else if (!commentDataById) {
        throw {
          status: "404 Not Found",
          message: `Maaf data comment dengan id: ${commentId} tidak dapat ditemukan di DB!`,
          code: 404,
          success: false,
        };
      }
    })
    .catch((err) => {
      next(err);
    });
}

function authorizationMessages(req, res, next) {
  const messageId = req.params.id;
  Messages.findByPk(messageId)
    .then((messageByIdData) => {
      if (messageByIdData) {
        if (messageByIdData.UserId == req.userDataId) {
          next();
        } else {
          throw {
            status: "401 Unauthorized!",
            message: `Maaf data message dengan id: ${messageId} bukanlah milik Anda!`,
            code: 401,
            success: false,
          };
        }
      } else if (!messageByIdData) {
        throw {
          status: "404 Not found!",
          message: `Maaf data message dengan id${messageId} tidak dapat ditemukan di DB!`,
          code: 404,
          success: false,
        };
      }
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  authorizationPost,
  authorizationLikes,
  authorizationComments,
  authorizationMessages,
};
