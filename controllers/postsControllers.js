const {
  Posts,
  Users,
  Profiles,
  Likes,
  Notifications,
  NotifContents,
  Follows,
} = require("../models");
const { Op } = require("sequelize");

class PostsControllers {
  static createNewPost(req, res, next) {
    const userIdWhoHasThisPost = req.userDataId;
    const newPostObjReadyToCreate = {
      postCaption: req.body.postCaption,
      postImageUrl: req.body.postImageUrl ? req.body.postImageUrl : null,
      postLike: 0,
      postDislike: 0,
      UserId: userIdWhoHasThisPost,
      status: req.body.status,
    };
    let newPostDataGenerate = null;
    let followerData = null;
    const senderName = req.body.senderName;
    Posts.create(newPostObjReadyToCreate)
      .then((newPostData) => {
        if (newPostData) {
          newPostDataGenerate = newPostData;
          res.status(201).json({
            status: "201 Success create new posts",
            message: `Success Create New Posts belongs to user with id: ${newPostObjReadyToCreate.UserId}`,
            newPost: newPostDataGenerate,
            code: 201,
            success: true,
          });

          return Follows.findAll({
            include: [
              { model: Users, include: { model: Profiles } },
              { model: Profiles, include: { model: Users } },
            ],
            order: [["id", "DESC"]],
          });
        } else if (!newPostData) {
          throw {
            status: "400 Bad Request",
            message: `Failed Create New Posts belongs to user with id: ${newPostObjReadyToCreate.UserId}`,
            code: 400,
            success: false,
          };
        }
      })
      .then((followsData) => {
        followerData = followsData.filter(
          (item) => item.Profile.UserId === userIdWhoHasThisPost
        );
        if (followerData.length > 0) {
          for (let i = 0; i < followerData.length; i++) {
            let newNotifObj = {
              type: "Posts",
              UserId: followerData[i].UserId,
            };
            Notifications.create(newNotifObj)
              .then((newNotifData) => {
                if (newNotifData) {
                  let payloadToNotifContent = {
                    sender_id: userIdWhoHasThisPost,
                    sender_name: senderName,
                    description: `${senderName} telah membuat post baru`,
                    source_id: newPostDataGenerate.id,
                    NotificationId: newNotifData.id,
                  };
                  return NotifContents.create(payloadToNotifContent);
                } else if (!newNotifData) {
                  throw {
                    status: "400 Failed create notification",
                    message: "Gagal membuat notification",
                    code: 400,
                    success: false,
                  };
                }
              })
              .then((notifContentResponse) => {
                if (notifContentResponse) {
                  res.status(201).json({
                    status: "Created!",
                    message:
                      "Berhasil membuat notifikasi baru dan notif content",
                    code: 201,
                    success: true,
                  });
                } else if (!notifContentResponse) {
                  throw {
                    status: "400 Failed create notif and notif content",
                    message:
                      "Gagal menambahakan data notifications dan notif content",
                    code: 400,
                    success: false,
                  };
                }
              })
              .catch((err) => {
                next(err);
              });
          }
        } else if (followerData.length < 1) {
          throw {
            status: "404 Not Found!",
            message: "There are no any follows right now",
            totalFollows: followsData.length,
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getAllPosts(req, res, next) {
    const currentUserLoginId = req.userDataId;
    const currentUserFollowingIds = req.finalFollowData;
    const currentSize = req.query.size;

    Posts.findAll({
      include: [
        {
          model: Users,
          include: { model: Profiles },
        },
        {
          model: Likes,
          include: { model: Users },
          order: [["id", "DESC"]],
        },
      ],
      order: [["id", "DESC"]],
    })
      .then((allPostsData) => {
        if (allPostsData.length > 0) {
          let finalAllPostMergedData = [];

          function checkRequirementFollowerOnly(followersOnly) {
            return (
              followersOnly.status === "FOLLOWERS_ONLY" &&
              (followersOnly.UserId === currentUserLoginId ||
                currentUserFollowingIds.includes(followersOnly.UserId))
            );
          }

          const publicStatusPosts =
            allPostsData.filter(
              (publicPost) => publicPost.status === "PUBLIC"
            ) || [];

          const privateStatusPosts =
            allPostsData.filter(
              (post) =>
                post.status === "PRIVATE" && post.UserId === currentUserLoginId
            ) || [];

          const followersOnlyStatusPosts =
            allPostsData.filter(checkRequirementFollowerOnly) || [];

          finalAllPostMergedData =
            [
              ...publicStatusPosts,
              ...privateStatusPosts,
              ...followersOnlyStatusPosts,
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) ||
            [];

          const currentTotalPosts = finalAllPostMergedData.length;

          const finalPostsSliced =
            typeof currentSize !== undefined && currentSize >= currentTotalPosts
              ? finalAllPostMergedData
              : typeof currentSize !== undefined &&
                currentSize < currentTotalPosts
              ? finalAllPostMergedData.splice(0, currentSize)
              : finalAllPostMergedData;

          if (finalAllPostMergedData.length > 0) {
            res.status(200).json({
              message: "Successs get all posts",
              posts: finalPostsSliced,
              totalPosts: currentTotalPosts,
              code: 200,
              success: true,
            });
          } else if (finalAllPostMergedData.length < 1) {
            res.status(200).json({
              message: "There are no any post",
              posts: finalAllPostMergedData,
              totalPosts: finalAllPostMergedData.length,
              code: 404,
              success: false,
            });
          }
        } else if (allPostsData.length < 1) {
          res.status(200).json({
            message: "There are no any post",
            posts: allPostsData,
            totalPosts: allPostsData.length,
            code: 404,
            success: false,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getPostById(req, res, next) {
    const postId = req.params.id;
    Posts.findByPk(postId, {
      include: {
        model: Users,
      },
    })
      .then((postDataById) => {
        if (postDataById) {
          res.status(200).json({
            status: "200 Success get post by id",
            message: `Success get post by id: ${postId}`,
            postData: postDataById,
            code: 200,
          });
        } else if (!postDataById) {
          throw {
            status: "404 Not Found!",
            message: `Sorry post with id: ${postId} cannot be found!`,
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static updatePostById(req, res, next) {
    const postId = req.params.id;
    const userIdWhoHasThisPost = req.userDataId;
    const postReadyToUpdate = {
      postCaption: req.body.postCaption,
      postImageUrl: req.body.postImageUrl ? req.body.postImageUrl : null,
      postLike: req.body.postLike,
      postDislike: req.body.postDislike,
      UserId: userIdWhoHasThisPost,
      status: req.body.status,
    };
    Posts.update(postReadyToUpdate, { where: { id: postId } })
      .then((updatedPostResult) => {
        if (updatedPostResult == 1) {
          res.status(201).json({
            status: "201 Success Edit Post By Id",
            message: `Success edit post with id: ${postId}!`,
            code: 201,
          });
        } else if (updatedPostResult == 0) {
          throw {
            status: "404 Not Found!",
            message: `Post with id: ${postId} cannot be found!`,
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static deletePostById(req, res, next) {
    const postId = req.params.id;
    Posts.destroy({ where: { id: postId } })
      .then((deletedPostResult) => {
        if (deletedPostResult == 1) {
          res.status(200).json({
            status: "201 Success delete this post",
            message: `Success delete this post with id: ${postId}!`,
            code: 200,
          });
        } else if (deletedPostResult == 0) {
          throw {
            status: "400 Failed to delete this post",
            message: `Failed to delete this post with id: ${postId}!`,
            code: 400,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static searchForPosts(req, res, next) {
    const searchTerms = req.query.searchTerms;
    Posts.findAll({
      where: {
        [Op.or]: [
          { postCaption: { [Op.substring]: searchTerms } },
          { postImageUrl: { [Op.substring]: searchTerms } },
        ],
      },
      include: { model: Users, include: { model: Profiles } },
    })
      .then((postDataOmonginApp) => {
        if (postDataOmonginApp.length > 0) {
          res.status(200).json({
            status: "200 Ok!",
            message: `Hasil search posts berdasarkan keyword: ${searchTerms}!`,
            postData: postDataOmonginApp,
          });
        } else if (postDataOmonginApp.length < 1) {
          throw {
            status: "404 Cannot find any posts!",
            message: `Tidak ada hasil search dari keyword: ${searchTerms}!`,
            code: 404,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = PostsControllers;
