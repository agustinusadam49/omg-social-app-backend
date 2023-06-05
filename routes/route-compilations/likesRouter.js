const router = require("express").Router();

const LikesControllers = require("../../controllers/likesControllers")
const authentication = require("../../middlewares/authentication");
const { authorizationLikes } = require("../../middlewares/authorization");

router.post("/", authentication, LikesControllers.addLike);
router.get("/", authentication, LikesControllers.getAllLikes);
router.get("/:id", authentication, LikesControllers.getLikeById);
router.put("/:id", authentication, authorizationLikes, LikesControllers.updateLikeById);
router.delete("/:id", authentication, authorizationLikes, LikesControllers.deleteLikeById);

module.exports = router