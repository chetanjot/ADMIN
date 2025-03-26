const mongoose = require("mongoose");

// Define the OTP schema
const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Add reference to the User model
      required: [true, "User ID is required"],
    },
    otp: {
      type: Number,
      required: [true, "OTP is required"],
    },
    expiryTime: {
      type: Date,
      default: Date.now,
      expires: 3600, // Expiry time in seconds (3600 = 1 hour)
      index: true, // Ensures TTL index for expiry
    },
    operation: {
      type: Number, // Define specific values if needed (e.g., 1 = login, 2 = reset password, etc.)
      required: [true, "Operation type is required"],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);
otpSchema.index({ userId: 1, operation: 1 }); 
// Compile the schema into a model
const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
