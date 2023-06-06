const {
  Messages,
  Users,
  Profiles,
  Notifications,
  NotifContents,
} = require("../models");

class MessagesControllers {
  static createMessage(req, res, next) {
    const currentUserId = req.userDataId;
    const receiverId = req.body.receiver_id;
    const senderName = req.body.senderName;
    let newMessageDataGenerate = null;
    const payloadFromRequestBody = {
      receiver_id: req.body.receiver_id,
      message_text: req.body.message_text,
      isRead: false,
      UserId: currentUserId,
    };

    Messages.create(payloadFromRequestBody)
      .then((newMessageData) => {
        if (newMessageData) {
          newMessageDataGenerate = newMessageData;
          res.status(201).json({
            status: "201 Success create new message",
            message: `Success Create New Message belongs to user with id: ${currentUserId}`,
            newMessage: newMessageDataGenerate,
            code: 201,
            success: true,
          });

          const newMessageNotifObj = {
            type: "Messages",
            UserId: receiverId,
          };
          return Notifications.create(newMessageNotifObj);
        } else if (!newMessageData) {
          throw {
            status: "400 Bad Request!",
            message: `Failed create new message belongs to user with id: ${currentUserId}`,
            code: 400,
            success: false,
          };
        }
      })
      .then((newNotifData) => {
        if (newNotifData) {
          const payloadToNotifContent = {
            sender_id: currentUserId,
            sender_name: senderName,
            description: `${senderName} telah mengirim pesan baru`,
            source_id: newMessageDataGenerate.id,
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
          return res.status(201).json({
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

  static readAllMessage(req, res, next) {
    const userReceiverIdFromQueryParam = parseInt(req.query.userReceiverId);
    const currentUserId = req.userDataId;

    Messages.findAll({
      include: {
        model: Users,
        include: { model: Profiles },
      },
      order: [["id", "DESC"]],
    })
      .then((messages) => {
        if (messages.length > 0) {
          const allMessagesMerged = [];

          const allMessagesDataFromDB = messages.map((item) => item);
          const sentMessages = allMessagesDataFromDB.filter(
            (message) =>
              message.UserId === currentUserId &&
              message.receiver_id === userReceiverIdFromQueryParam
          );
          const incomingMessages = allMessagesDataFromDB.filter(
            (message) =>
              message.receiver_id === currentUserId &&
              message.UserId === userReceiverIdFromQueryParam
          );
          sentMessages.forEach((messageSent) => { allMessagesMerged.push(messageSent) });
          incomingMessages.forEach((messageIncoming) => { allMessagesMerged.push(messageIncoming) });

          const sortedMessagesByDate = allMessagesMerged.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );

          res.status(200).json({
            status: "200 Get All Messages",
            message: "Successs get all Messages",
            messagesData: sortedMessagesByDate,
            totalMessages: sortedMessagesByDate.length,
            code: 200,
            success: true,
          });
        } else {
          res.status(200).json({
            status: "404 Not Found!",
            message: "There are no any messages right now",
            totalMessages: messages.length,
            code: 404,
            success: false,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static readMessageById(req, res, next) {
    console.log("Get message by id");
  }

  static updateMessageById(req, res, next) {
    const messageId = req.params.id;
    const messageReadyToUpdate = {
      receiver_id: req.body.receiver_id,
      message_text: req.body.message_text,
      isRead: req.body.isRead,
      UserId: req.body.UserId,
    };
    Messages.update(messageReadyToUpdate, { where: { id: messageId } })
      .then((updatedMessageById) => {
        if (updatedMessageById == 1) {
          res.status(201).json({
            status: "201 Success Edit Message By Id",
            message: `Success edit Message with id: ${messageId}!`,
            code: 201,
            success: true,
          });
        } else if (updatedMessageById == 0) {
          throw {
            status: "404 Not Found!",
            message: `Message with id: ${messageId} cannot be found!`,
            code: 404,
            success: false,
          };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteMessageById(req, res, next) {
    console.log("Delete message by id");
  }
}

module.exports = MessagesControllers;
