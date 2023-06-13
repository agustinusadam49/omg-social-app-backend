const { Notifications, NotifContents } = require("../models");

class NotificationsControllers {
  static createNewNotification(req, res, next) {
    const currentUserId = req.userDataId;
    const receiverId = req.body.receiver_id;
    const senderName = req.body.senderName;
    const statusFollow = req.body.statusFollow;
    const source_id = req.body.source_id;

    const newFollowNotifObj = {
      type: "Follows",
      UserId: receiverId,
    };

    Notifications.create(newFollowNotifObj)
      .then((newNotifData) => {
        if (newNotifData) {
          const payloadToNotifContent = {
            sender_id: currentUserId,
            sender_name: senderName,
            description: `${senderName} telah ${statusFollow} anda`,
            source_id: source_id,
            NotificationId: newNotifData.id,
          };
          return NotifContents.create(payloadToNotifContent);
        } else if (!newNotifData) {
          throw {
            status: "400 Failed create notification",
            message: "Gagal membuat notification",
            code: 400,
            success: false,
          };
        }
      })
      .then((notifContentResponse) => {
        if (notifContentResponse) {
          res.status(201).json({
            status: "Created!",
            message: "Berhasil membuat notifikasi baru dan notif content",
            code: 201,
            success: true,
          });
        } else if (!notifContentResponse) {
          throw {
            status: "400 Failed create notif and notif content",
            message: "Gagal menambahakan data notifications dan notif content",
            code: 400,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static readAllNotificationsOfCurrentUser(req, res, next) {
    const currentUserId = req.userDataId;
    Notifications.findAll({
      where: { UserId: currentUserId },
      include: { model: NotifContents },
      order: [["id", "DESC"]],
    })
      .then((notifResponses) => {
        if (notifResponses.length > 0) {
          res.status(200).json({
            status: "200 Get All notifications of current user",
            message: "Successs get all notifications of current user",
            notifications: notifResponses,
            totalNotif: notifResponses.length,
            code: 200,
            success: true,
          });
        } else if (notifResponses.length < 1) {
          res.status(200).json({
            status: "404 Not Found!",
            message: "There are no any notifications of current user right now",
            totalNotif: notifResponses.length,
            code: 404,
            success: false,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static bulkUpdateNotificationStatusRead(req, res, next) {
    const userIdFromApiParam = req.params.UserId;
    const notifType = req.body.type;
    const payload = {
      isRead: req.body.isRead,
    };
    Notifications.update(payload, {
      where: { UserId: userIdFromApiParam, type: notifType, isRead: false },
    })
      .then((updatedNotificationById) => {
        if (!!updatedNotificationById) {
          res.status(201).json({
            code: 201,
            message: `Success update all notification status read with type: ${notifType} and with UserId: ${userIdFromApiParam}!`,
            success: true,
          });
        } else {
          throw {
            code: 404,
            message: `Cannot found notifications with UserId: ${userIdFromApiParam}!`,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static updateNotificationById(req, res, next) {
    const currentUserId = req.userDataId;
    const notificationId = req.params.id;
    const payload = {
      type: req.body.type,
      notifImageUrl: req.body.notifImageUrl,
      isRead: true,
      UserId: currentUserId,
    };
    Notifications.update(payload, { where: { id: notificationId } })
      .then((updatedNotificationById) => {
        if (updatedNotificationById == 1) {
          res.status(201).json({
            code: 201,
            message: `Success update notification status read with id: ${notificationId}!`,
            success: true,
          });
        } else if (updatedNotificationById == 0) {
          throw {
            code: 404,
            message: `Cannot found notification with id: ${notificationId}!`,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteNotificationById(req, res, next) {
    const notificationId = req.params.id;
    Notifications.destroy({ where: { id: notificationId } })
      .then((deletedNotificationResult) => {
        if (deletedNotificationResult == 1) {
          return NotifContents.destroy({
            where: { NotificationId: notificationId },
          });
        } else if (deletedNotificationResult == 0) {
          throw {
            code: 404,
            message: `Cannot found notification with id: ${notificationId}!`,
            success: false,
          };
        }
      })
      .then((deletedNotifContentResponse) => {
        if (deletedNotifContentResponse == 1) {
          res.status(200).json({
            code: 200,
            message: `Success delete Notification and NotifContent data with id: ${notificationId}!`,
            success: true,
          });
        } else if (deletedNotifContentResponse == 0) {
          throw {
            code: 404,
            message: `Cannot found notification content with NotificationId: ${notificationId}!`,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = NotificationsControllers;
