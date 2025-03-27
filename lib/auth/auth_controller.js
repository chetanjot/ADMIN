const response = require("../../responsesHandler/response_handler");
const passwordManager = require("../../helpers/password_manager.js");

const {
  messages,
  invitationSent,
} = require("../../core/constants/server_messages");

const User = require("../../models/users/users");

const jwt = require("../../helpers/jwt_helper");
const UserAccessToken = require("../../models/users/user_access_tokens");

const universalFunctions = require("../../utils/universal_function");
const {
  TOKENOPREATIONS,
  otpOperations,
  userRoles,
  jwtExpires,
  userStatus,
} = require("../../core/constants/common_status");

exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find the user based on the email
    const user = await User.findOne({
      email: email.toLowerCase(),
      is_deleted: 0,
      role: "Admin",
    });

    if (!user) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].incorrectEmailOrPassword,
        data: {},
      });
    }

    // Verify the password
    const isPasswordCorrect = await passwordManager.comparePassword({
      plainPassword: password,
      hashPassword: user.password,
    });

    if (!isPasswordCorrect) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].incorrectEmailOrPassword,
        data: {},
      });
    }

   

    // Generate JWT tokens
    const accessToken = await jwt.jwtSign(
      { email: user.email, id: user.id },
      rememberMe ? jwtExpires.loginRemember : jwtExpires.login
    );

    const refreshToken = await jwt.jwtSign(
      { email: user.email, id: user.id },
      rememberMe ? jwtExpires.refreshRemember : jwtExpires.refresh
    );

    // Remove sensitive data
    const userData = { ...user._doc };
    delete userData.password;

    // Add tokens to response
    userData.accessToken = accessToken;
    userData.refreshToken = refreshToken;

    // Store access and refresh tokens in the database
    await universalFunctions.createAccessToken({
      user_id: user._id,
      access_token: jwt.encryptAccessToken(accessToken),
      refresh_token: jwt.encryptAccessToken(refreshToken),
    });
    console.log("==========userData===", userData);
    // Respond with success
    return response.okHttpResponse({
      response: res,
      message: messages[req.language].loginSuccess,
      data: userData,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};
