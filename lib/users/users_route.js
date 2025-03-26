const express = require("express");
const router = express.Router();
const userController = require("./users_controller");
const userValidator = require("./users_validator");


/*Get user profile details*/
router.get("/profile", userController.getProfile);


module.exports = router;
