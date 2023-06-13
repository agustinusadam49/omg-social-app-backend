const { NotifContents, Notifications } = require("../models");

class NotifContentControllers {
  static readAllNotifContents(req, res, next) {
    NotifContents.findAll({
      include: { model: Notifications },
      order: [["id", "DESC"]],
    })
      .then((notifContentResponses) => {
        if (notifContentResponses.length > 0) {
          console.log(notifContentResponses)
          res.status(200).json({
            message: "Successs get all notifications contents of current user",
            data: notifContentResponses,
            totalData: notifContentResponses.length,
            code: 200,
            success: true,
          });
        } else if (notifContentResponses.length < 1) {
          res.status(200).json({
            message: "There are no any notifications contents of current user right now",
            totalData: notifContentResponses.length,
            code: 404,
            success: false,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = NotifContentControllers;
