const router = require("express").Router();

const landing_router = require("./route-compilations/landingRouter");
const user_router = require("./route-compilations/userRouter");
const post_router = require("./route-compilations/postsRouter");
const likes_router = require("./route-compilations/likesRouter");
const comments_router = require("./route-compilations/commentsRouter");
const reply_comments_router = require("./route-compilations/replyCommentsRouter");
const profile_router = require("./route-compilations/profilesRouter");
const message_router = require("./route-compilations/messageRouter");
const follow_router = require("./route-compilations/followRouter");
const notifications_router = require("./route-compilations/notificationsRouter");
const notif_contents_router = require("./route-compilations/notifContentsRouter");

router.use("/", landing_router);
router.use("/users", user_router);
router.use("/posts", post_router);
router.use("/likes", likes_router);
router.use("/comments", comments_router);
router.use("/reply-comments", reply_comments_router);
router.use("/profiles", profile_router);
router.use("/messages", message_router);
router.use("/follows", follow_router);
router.use("/notifications", notifications_router);
router.use("/notif-contents", notif_contents_router);

module.exports = router;