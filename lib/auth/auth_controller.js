const response = require("../../responsesHandler/response_handler");
const passwordManager = require("../../helpers/password_manager.js");
const bcrypt = require("bcrypt");
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
const otpModel = require("../../models/auth/otp_model.js");
const sendOTP = require("../../helpers/sendMail.js");

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.params;

    // Find the user based on the identifier
    const user = await User.findOne({ email });

    // if user user not found
    if (!user) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].incorrectEmail,
        data: {},
      });
    }

    // Remove the OTP record from database if exist
    await otpModel.deleteOne({
      userId: user._id,
      operation: parseInt(TOKENOPREATIONS.PASSWORDRESET),
    });
    // Generate OTP for verification
    const otp = await universalFunctions.generateOtp(
      user._id,
      TOKENOPREATIONS.PASSWORDRESET
    );

    if (!otp) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].otpNotSend,
        data: {},
      });
    }

    // Send OTP via email
    await sendOTP(email, otp);

    return response.okHttpResponse({
      response: res,
      message: messages[req.language].otpSend,
      data: { _id: user._id, otp },
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { _id } = req.params;
    const { newPassword, confirmPassword, otp } = req.body;

    if (newPassword != confirmPassword) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].passwordNotMatch,
        data: {},
      });
    }

    // Find the user based on the _id(userId)
    const user = await User.findOne({ _id });

    // if user user not found
    if (!user) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].userNotFound,
        data: {},
      });
    }

    const operation = parseInt(TOKENOPREATIONS.PASSWORDRESET);
    const userOtp = await otpModel.findOne({
      userId: user._id,
      operation,
      otp,
    });
    if (!userOtp) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].incorrectOtp,
        data: {},
      });
    }

    // update user password
    const password = await bcrypt.hash(newPassword, 10);
    const updatedPassword = await User.findOneAndUpdate(
      { _id: user._id, is_deleted: 0 },
      { $set: { password } }
    );
    if (updatedPassword) {
      return response.okHttpResponse({
        response: res,
        message: messages[req.language].passwordUpdated,
        data: {},
      });
    }

    return response.badHttpResponse({
      response: res,
      message: messages[req.language].passwordNotUpdated,
      data: {},
    });
  } catch (error) {
    console.error("Error during reset password:", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};
