const { check, validationResult } = require("express-validator");
const { messages } = require("../../core/constants/server_messages");
const response = require("../../responsesHandler/response_handler");


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

exports.validateChangePasswordInput = [
   
    // Password validation
    check("oldPassword")
      .trim()
      .notEmpty()
      .withMessage((value, { req }) =>messages[req.language].passwordOldRequired)
      .isLength({ min: 6 })
      .withMessage((value, { req }) =>messages[req.language].passwordAtLeast), 
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