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

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user;

    const {
      username,
      bio,
      website,
      profilePhoto,
      dateOfBirth,
      phone,
      name,
      countryCode,
      language,
      pushNotification,
      emailNotification
    } = req.body;
    const updateProfileData = {
      username,
      bio,
      website,
      dateOfBirth,
      profilePhoto,
      phone,
      name,
      countryCode,
      language,
      status: 1,
      pushNotification,
      emailNotification
    };

    /*Check if username is already exist*/
    if (username) {
      const usernameExist = await userModel.findOne({
        username,
        is_deleted: 0,
        _id: { $ne: userId }, // Exclude the current user's ID
      });
      if (usernameExist) {
        return response.badHttpResponse({
          response: res,
          message: messages[req.language].userNameAlreradyExists,
          data: {},
        });
      }
    }

    /*Check if phone is already exist*/
    if (phone) {
      const phoneNumberExist = await userModel.findOne({
        phone,
        countryCode,
        is_deleted: 0,
        _id: { $ne: userId }, // Exclude the current user's ID
      });
      if (phoneNumberExist) {
        return response.badHttpResponse({
          response: res,
          message: messages[req.language].phoneAlreradyExists,
          data: {},
        });
      }
    }

    /*Update user profile query*/
    const updatedProfile = await userModel.findOneAndUpdate(
      { _id: userId, is_deleted: 0 },
      updateProfileData,
      {
        new: true,
      }
    );

    // if user user not found
    if (!updatedProfile) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].userNotFound,
        data: {},
      });
    }

    return response.okHttpResponse({
      response: res,
      message: messages[req.language].updatedProfile,
      data: updatedProfile || {},
    });
  } catch (error) {
    console.error("Error during update profile details:", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const userId = req.user;

    const {
      oldPassword,
      newPassword,
      confirmPassword
    } = req.body;
  
    console.log("=====req.body===",req.body)

   
  } catch (error) {
    console.error("Error during change password:", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};