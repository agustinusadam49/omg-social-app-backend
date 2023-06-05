const router = require("express").Router();

const NotificationsControllers = require("../../controllers/notificationsControllers");
const authentication = require("../../middlewares/authentication");

router.post("/notif-current-user", authentication, NotificationsControllers.createNewNotification);
router.get("/notif-current-user", authentication, NotificationsControllers.readAllNotificationsOfCurrentUser);
router.put("/:id", authentication, NotificationsControllers.updateNotificationById);
router.put("/:UserId/bulk-update", authentication, NotificationsControllers.bulkUpdateNotificationStatusRead);
router.delete("/:id/delete-notification", authentication, NotificationsControllers.deleteNotificationById);

module.exports = router;
