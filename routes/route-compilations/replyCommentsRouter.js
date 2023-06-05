const router = require("express").Router();

const ReplyCommentsControllers = require("../../controllers/replyCommentControllers");
const authentication = require("../../middlewares/authentication");

router.post("/", authentication, ReplyCommentsControllers.createNewReplyComments);
router.get("/:CommentId", authentication, ReplyCommentsControllers.getReplyCommentsByCommentId);

module.exports = router;
