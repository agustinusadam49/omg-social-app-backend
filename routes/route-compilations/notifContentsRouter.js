const router = require("express").Router();

const NotifContentControllers = require("../../controllers/notifContentControllers");
const authentication = require("../../middlewares/authentication");
// const { authorizationMessages } = require("../../middlewares/authorization");

router.get("/", authentication, NotifContentControllers.readAllNotifContents);

module.exports = router;