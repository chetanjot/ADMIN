require("dotenv").config();
const uuid = require("uuid");
const mongoose = require("mongoose");
const otpModel = require("../models/auth/otp_model");
const User = require("../models/users/users");
const UserAccessToken = require("../models/users/user_access_tokens");

exports.createAccessToken = async (tokenData) => {
  try {
    await UserAccessToken.create(tokenData);
  } catch (err) {
    throw new Error(err);
  }
};

exports.generateOtp = async (userId, operation) => {
  try {
    const operationModified = operation;
    const otp = Math.floor(100000 + Math.random() * 900000);
    await otpModel.create({
      otp,
      userId,
      operation: operationModified,
    });
    return otp;
  } catch (error) {
    return error;
  }
};