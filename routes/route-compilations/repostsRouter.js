const router = require("express").Router();

const RepostControllers = require("../../controllers/repostControllers");
const authentication = require("../../middlewares/authentication");

router.post("/", authentication, RepostControllers.createRepost);

module.exports = router;
