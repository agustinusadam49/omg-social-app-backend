const {
  Posts,
  Users,
  Profiles,
  Likes,
  Notifications,
  NotifContents,
  Follows,
  RePosts,
} = require("../models");
const {
  modifyObjectArr,
  getPublicPostStatus,
  getPrivatePostStatus,
  getFollowersOnlyPostStatus,
  getFinalPostData,
} = require("./utils/postsControllerUtils");
const { Op } = require("sequelize");

class PostsControllers {
  static createNewPost(req, res, next) {
    const userIdWhoHasThisPost = req.userDataId;
    const newPostObjReadyToCreate = {
      postCaption: req.body.postCaption,
      postImageUrl: req.body.postImageUrl ? req.body.postImageUrl : null,
      UserId: userIdWhoHasThisPost,
      status: req.body.status,
      postStatus: "ORIGINAL_POST",
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

  static createNewRepost(req, res, next) {
    const userIdWhoHasThisPost = req.userDataId;
    const { postCaption, postStatus, sourcePostId, senderName } = req.body;

    const payloadForPost = {
      postCaption: postStatus === "REPOST" ? "reposted" : postCaption,
      postImageUrl: null,
      UserId: userIdWhoHasThisPost,
      status: "FOLLOWERS_ONLY",
      postStatus: postStatus,
    };

    let newPostDataGenerate = null;
    let followerData = null;

    Posts.create(payloadForPost)
      .then((newPostResponse) => {
        if (newPostResponse) {
          newPostDataGenerate = newPostResponse;

          const payloadForRepost = {
            PostId: newPostResponse.id,
            UserId: userIdWhoHasThisPost,
            sourcePostId: sourcePostId,
          };

          return RePosts.create(payloadForRepost);
        } else if (!newPostResponse) {
          throw {
            status: "400 Bad Request",
            message: `Failed Create New Repost belongs to user with id: ${userIdWhoHasThisPost}`,
            code: 400,
            success: false,
          };
        }
      })
      .then((newRepostResponse) => {
        if (newRepostResponse) {
          res.status(201).json({
            status: "201 Success create new posts",
            message: `Success Create New Reposts belongs to user with id: ${userIdWhoHasThisPost}`,
            newPost: newPostDataGenerate,
            code: 201,
            success: true,
          });

          return Posts.findByPk(sourcePostId);
        } else if (!newRepostResponse) {
          throw {
            status: "400 Bad Request!",
            message: `Failed create new Repost belongs to user with id: ${userIdWhoHasThisPost}`,
            code: 400,
            success: false,
          };
        }
      })
      .then((postByIdResponse) => {
        if (postByIdResponse) {
          const newRepostCounter = postByIdResponse.repostCounter + 1;

          return Posts.update(
            { repostCounter: newRepostCounter },
            { where: { id: sourcePostId } }
          );
        } else if (!postByIdResponse) {
          throw {
            status: "404 Not Found!",
            message: `Sorry post with id: ${sourcePostId} cannot be found!`,
            code: 404,
          };
        }
      })
      .then((postUpdateResultResponse) => {
        if (postUpdateResultResponse == 1) {
          res.status(201).json({
            status: "201 Success update repost data!",
            message: `Berhasil edit data repost dengan ID: ${sourcePostId}!`,
            code: 201,
          });

          return Follows.findAll({
            include: [
              { model: Users, include: { model: Profiles } },
              { model: Profiles, include: { model: Users } },
            ],
            order: [["id", "DESC"]],
          });
        } else {
          throw {
            status: "404 Not Found!",
            message: `Maaf data repost dengan ID: ${sourcePostId} tidak dapat ditemukan!`,
            code: 404,
          };
        }
      })
      .then((followsData) => {
        console.log("followsData followsData followsData followsData:", followsData)
        followerData = followsData.filter(
          (item) => item.Profile.UserId === userIdWhoHasThisPost
        );
        if (followerData.length > 0) {
          for (let i = 0; i < followerData.length; i++) {
            const newNotifObj = {
              type: "Posts",
              UserId: followerData[i].UserId,
            };

            Notifications.create(newNotifObj)
              .then((newNotifData) => {
                if (newNotifData) {
                  const payloadToNotifContent = {
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
        { model: RePosts },
      ],
      order: [["id", "DESC"]],
    })
      .then((allPostsData) => {
        if (allPostsData.length > 0) {
          let finalAllPostMergedData = [];

          const publicStatusPosts = getPublicPostStatus(allPostsData);

          const privateStatusPosts = getPrivatePostStatus(
            allPostsData,
            currentUserLoginId
          );

          const followersOnlyStatusPosts = getFollowersOnlyPostStatus(
            allPostsData,
            currentUserLoginId,
            currentUserFollowingIds
          );

          finalAllPostMergedData = modifyObjectArr([
            ...publicStatusPosts,
            ...privateStatusPosts,
            ...followersOnlyStatusPosts,
          ]);

          const currentTotalPosts = finalAllPostMergedData.length;

          const finalPostsSliced = getFinalPostData(
            finalAllPostMergedData,
            currentSize,
            currentTotalPosts
          );

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
