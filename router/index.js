const Router = require("express");
const router = new Router();
const userController = require("../controllers/user-controller.js");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/users", userController.getUsers);

module.exports = router;
