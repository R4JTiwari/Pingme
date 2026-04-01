const User = require("../models/user.model");
const sendEmail = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otp.model");

const otpStore = {}; // temporary storage

// 📩 Send OTP
const sendOTP = async (req, res) => {
  try {
    const { email, username, phone } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      username,
      phone
    };

    await sendEmail(email, "PingMe OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// ✅ Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedData = otpStore[email];

    // ✅ small fix
    if (!storedData || storedData.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // ✅ use stored data
      user = await User.create({
        email,
        username: storedData.username,
        phone: storedData.phone,
        // password: "otp_login" // minimal fix (or make optional in model)
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET
    );

    delete otpStore[email];

    res.json({ token, user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};