const router = require("express").Router();

const LandingControllers = require("../../controllers/landingControllers");

router.get("/", LandingControllers.getLandingPage)

module.exports = router