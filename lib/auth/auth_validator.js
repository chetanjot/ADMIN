const { check, validationResult } = require("express-validator");
const User = require("../../models/users/users");
const { messages } = require("../../core/constants/server_messages");
const response = require("../../responsesHandler/response_handler");
const { userStatus } = require("../../core/constants/common_status");


exports.result = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.badHttpResponse({
      response: res,
      message: errors.array()[0].msg,
      data: [],
    });
  }
  next();
};





exports.validateUserLogin = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) =>messages[req.language].enterEmail)
    .custom(async (value, { req }) => {
      let user = null;

      // Check if the identifier is an email
      if (value.includes("@")) {
        // If it's an email, check in the User collection
        user = await User.findOne({ email: value.toLowerCase() });
        if (!user) {
          throw new Error(messages[req.language].incorrectEmailOrPassword);
        }
      } 

      // Additional checks if the user exists
      if (user.is_deleted == 1) {
        throw new Error(messages[req.language].emailNotFound);
      }
   
    
    }),

  check("password")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) =>messages[req.language].passwordRequired)
    .custom(async (value, { req }) => {
      const { email } = req.body;
      let user = null;

      // Check if the identifier is an email
      if (email.includes("@")) {
        user = await User.findOne({ email: email.toLowerCase() });
      } 
    }),
];


exports.validateResetPasswordInput = [
  check("otp").trim().notEmpty().bail().withMessage((value, { req }) =>messages[req.language].otpRequired),
  // Password validation
  check("newPassword")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) =>messages[req.language].passwordRequired)
    .isLength({ min: 6 })
    .withMessage((value, { req }) =>messages[req.language].passwordAtLeast),
  check("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage((value, { req }) =>messages[req.language].confirmPasswordRequired)
    .isLength({ min: 6 })
    .withMessage((value, { req }) =>messages[req.language].passwordAtLeast),
];
