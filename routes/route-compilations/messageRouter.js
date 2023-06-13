const router = require("express").Router();

const MessagesControllers = require("../../controllers/messageControllers");
const authentication = require("../../middlewares/authentication");
const { authorizationMessages } = require("../../middlewares/authorization");

router.post("/", authentication, MessagesControllers.createMessage);
router.get("/", authentication, MessagesControllers.readAllMessage);
router.get("/:id", authentication, MessagesControllers.readMessageById);
router.put("/:id", authentication, MessagesControllers.updateMessageById);
router.delete("/:id", authentication, authorizationMessages, MessagesControllers.deleteMessageById);

module.exports = router;