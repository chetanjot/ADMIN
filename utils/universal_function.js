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