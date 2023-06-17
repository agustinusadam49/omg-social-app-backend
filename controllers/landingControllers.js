const { generateToken } = require("../helpers/jwt");

class LandingControllers {
  static getLandingPage(req, res, next) {
    const devPort = 5100
    const envPort = Number(process.env.PORT)
    res.status(200).json({
      message: "Masuk ke end-point landing page router",
      code: 200,
      onPort: envPort || devPort,
      onEnvironment: process.env.NODE_ENV,
      success: true
    });
  }
}

module.exports = LandingControllers;
