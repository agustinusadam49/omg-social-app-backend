const router = require("express").Router();

const CommentControllers = require("../../controllers/commentControllers");
const authentication = require("../../middlewares/authentication");
const { authorizationComments } = require("../../middlewares/authorization");

router.post("/", authentication, CommentControllers.createNewComment);
router.get("/", authentication, CommentControllers.getAllComments);
router.get("/by-post-id/:PostId", authentication, CommentControllers.getCommentByPostId);
router.get("/:id", authentication, CommentControllers.getCommentById);
router.put("/:id", authentication, authorizationComments, CommentControllers.updateCommentById);
router.delete("/:id", authentication, authorizationComments, CommentControllers.deleteCommentById);

module.exports = router;