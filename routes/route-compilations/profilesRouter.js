const router = require("express").Router();

const ProfilesControllers = require("../../controllers/profilesControllers");
const authentication = require("../../middlewares/authentication");

router.put("/:id", authentication, ProfilesControllers.editProfileById);

module.exports = router;