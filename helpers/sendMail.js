const nodemailer = require("nodemailer");

// Configure the transporter
const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user:"e912b0fc371661",
      pass:"b0d4a13aed043f"
    },
});

/**
 * Send OTP Email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP to send
 */
const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: "chetanjot.singh@debutinfotech.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("======result===",result)
    console.log("OTP email sent successfully!");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

module.exports = sendOTP;
