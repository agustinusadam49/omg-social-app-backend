const router = require("express").Router();

const FollowControllers = require("../../controllers/followControllers");
const authentication = require("../../middlewares/authentication");

router.post("/", authentication, FollowControllers.createFollow);
router.get("/", authentication, FollowControllers.readAllFollows);
router.get("/follower-current-user", authentication, FollowControllers.readAllFollowerOfCurrentUser);
router.get("/following-current-user", authentication, FollowControllers.readAllFollowingOfCurrentUser);
router.get("/:id", authentication, FollowControllers.readFollowById);
router.put("/:id", authentication, FollowControllers.updateFollowById);
router.delete("/:id", authentication, FollowControllers.deleteFollowById);

module.exports = router;
