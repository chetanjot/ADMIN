const express = require("express");
const router = express.Router();
const authController = require("./auth_controller");
const authValidator = require("./auth_validator");



/**
 * User Login Route
 * Handles user login by validating the input (email and password)
 * and then calling the login function from the authController.
 */
router.post(
  "/login",
  [authValidator.validateUserLogin, authValidator.result],
  authController.login
);

/**
 * Forgot password Route
 */
router.get(
  "/forgotPassword/:email",
  authController.forgotPassword // Call the forgotPassword function from the controller
);

/**
 * Reset password Route
 */
router.patch(
  "/resetPassword/:_id",
  [authValidator.validateResetPasswordInput, authValidator.result],
  authController.resetPassword // Call the resetPassword function from the controller
);

module.exports = router;
