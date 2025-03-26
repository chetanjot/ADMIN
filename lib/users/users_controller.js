const mongoose = require("mongoose");
const response = require("../../responsesHandler/response_handler");
const { messages } = require("../../core/constants/server_messages");
const userModel = require("../../models/users/users");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user;

    const userProfile = await userModel.findById(userId).select("-password");

    // if user user not found
    if (!userProfile) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].userNotFound,
        data: {},
      });
    }

    return response.okHttpResponse({
      response: res,
      message: messages[req.language].profileDetails,
      data: userProfile || {},
    });
  } catch (error) {
    console.error("Error during get profile details:", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};
