const mongoose = require("mongoose");
const passwordManager = require("../../helpers/password_manager.js");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    countryCode: {
      type: String,
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
    },
    is2FAEnabled: { type: Boolean, default: false },
    twoFAType: { type: String, enum: ["email", "sms"], default: "email" },
    twoFASecret: { type: String },

    bio: { type: String, default: "" },
   
    dateOfBirth: {
      type: String,
    },
    pushNotification: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      enum: ["en", "es", "fr", "de", "zh", "hi", "mt", "ua", "ru", "ar"],
      default: "en",
      // required: true,
    },
    gender: {
      type: String, enum: ["Male","Female","Other"],
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
   
   
    role: {
      type: String, enum: ["Admin","User"],
      defaut:"User"
    }, 
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Static method to fetch active users
userSchema.statics.getActiveUsers = function () {
  return this.find({ is_deleted: 0 });
};

// Pre-save middleware to hash passwords
userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
      this.password = await passwordManager.encryptPassword(this.password);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-findOneAndUpdate middleware to hash passwords
userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    if (update.password) {
      update.password = await passwordManager.encryptPassword(update.password);
      this.setUpdate(update);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Compile the schema into a model
const User = mongoose.model("User", userSchema);

module.exports = User;
