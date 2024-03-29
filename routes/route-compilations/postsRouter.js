const router = require("express").Router();

const PostsControllers = require("../../controllers/postsControllers");
const authentication = require("../../middlewares/authentication")
const { authorizationPost } = require("../../middlewares/authorization");
const { checkCurrentUserFollowing } = require("../../middlewares/checkCurrentUserFollowing");

router.post("/", authentication, PostsControllers.createNewPost);
router.get("/", authentication, checkCurrentUserFollowing, PostsControllers.getAllPosts);
router.get("/search-posts", authentication, PostsControllers.searchForPosts);
router.get("/:id", authentication, authorizationPost, PostsControllers.getPostById);
router.put("/:id", authentication, authorizationPost, PostsControllers.updatePostById);
router.delete("/:id", authentication, authorizationPost, PostsControllers.deletePostById);

module.exports = router;