const router = require("express").Router();

const RepostControllers = require("../../controllers/repostControllers");
const authentication = require("../../middlewares/authentication");

router.post("/", authentication, RepostControllers.createNewRepost);

module.exports = router;
