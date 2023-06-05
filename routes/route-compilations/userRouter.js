const router = require("express").Router();
const UserControllers = require("../../controllers/userControllers");
const authentication = require("../../middlewares/authentication");
// const checkUserEmailVerificationStatus = require("../middlewares/checkUserEmailVerificationStatus");

router.post("/register", UserControllers.registerUser);
router.post("/login", UserControllers.userLogin);
router.get("/get-current-user", authentication, UserControllers.getCurrentUserLogin);
router.get("/admin", UserControllers.getAllUsersOfOmonginAppForAdmin);
router.put("/send-email-verification/:id", UserControllers.sendEmailVerification);
router.put("/logout/:id", UserControllers.userLogout);

router.get("/get-all-users", authentication, UserControllers.getAllUsersOfOmonginApp);
router.get("/search-user", authentication, UserControllers.searchForUser);
router.get("/:id", authentication, UserControllers.getUserById);
router.put("/:id", authentication, UserControllers.updateUserById);
router.delete("/:id", authentication, UserControllers.deleteUserById);

module.exports = router;