function getRepostData(repostObjData, inputArr) {
  return inputArr.filter((post) => post.id === repostObjData.sourcePostId)[0];
}

function modifyObjectArr(inputArr) {
  return (
    inputArr
      .map((post) => {
        const {
          UserId,
          createdAt,
          id,
          postCaption,
          postDislike,
          postImageUrl,
          postLike,
          postStatus,
          repostCounter,
          status,
          updatedAt,
          User,
          Likes,
          RePost,
        } = post;
        return {
          UserId,
          createdAt,
          id,
          postCaption,
          postDislike,
          postImageUrl,
          postLike,
          postStatus,
          repostCounter,
          status,
          updatedAt,
          User,
          Likes,
          repost: RePost !== null ? getRepostData(RePost, inputArr) : null,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || []
  );
}

function checkRequirementFollowerOnly(
  followersOnly,
  currentUserLoginId,
  currentUserFollowingIds
) {
  return (
    followersOnly.status === "FOLLOWERS_ONLY" &&
    (followersOnly.UserId === currentUserLoginId ||
      currentUserFollowingIds.includes(followersOnly.UserId))
  );
}

function getPublicPostStatus(inputArr) {
  return inputArr.filter((publicPost) => publicPost.status === "PUBLIC") || [];
}

function getPrivatePostStatus(inputArr, currentUserLoginId) {
  return (
    inputArr.filter(
      (post) => post.status === "PRIVATE" && post.UserId === currentUserLoginId
    ) || []
  );
}

function getFollowersOnlyPostStatus(
  allPostsData,
  currentUserLoginId,
  currentUserFollowingIds
) {
  return (
    allPostsData.filter((followersOnly) =>
      checkRequirementFollowerOnly(
        followersOnly,
        currentUserLoginId,
        currentUserFollowingIds
      )
    ) || []
  );
}

function getFinalPostData(
  finalAllPostMergedData,
  currentSize,
  currentTotalPosts
) {
  const result =
    typeof currentSize !== undefined && currentSize >= currentTotalPosts
      ? finalAllPostMergedData
      : typeof currentSize !== undefined && currentSize < currentTotalPosts
      ? finalAllPostMergedData.splice(0, currentSize)
      : finalAllPostMergedData;

  return result;
}

module.exports = {
  modifyObjectArr,
  checkRequirementFollowerOnly,
  getPublicPostStatus,
  getPrivatePostStatus,
  getFollowersOnlyPostStatus,
  getFinalPostData,
};
