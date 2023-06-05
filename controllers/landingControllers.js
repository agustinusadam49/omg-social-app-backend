const { generateToken } = require("../helpers/jwt");

class LandingControllers {
  static getLandingPage(req, res, next) {
    const userToken = generateToken({
      id: 1,
      email: "adam@email.com",
      password: "kampret",
    });
    const toError = false;
    const errorMessage = {
      status: "404 Not Found!",
      message: "Masuk error",
      code: 404,
    };
    if (toError) {
      next(errorMessage);
    } else if (!toError) {
      res.status(200).json({
        status: "201 Ok!",
        message: "Masuk ke end-point landing page router",
        iniToken: req.headers,
        user_token: userToken,
        code: 201,
      });
    }
  }
}

module.exports = LandingControllers;
