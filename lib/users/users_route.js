const express = require("express");
const router = express.Router();
const userController = require("./users_controller");
const userValidator = require("./users_validator");


/*Get user profile details*/
router.get("/profile", userController.getProfile);
/*Update profile details*/
router.patch("/profile", userController.updateProfile);

/*Change password*/
router.patch("/change-password", userController.changePassword);


module.exports = router;
