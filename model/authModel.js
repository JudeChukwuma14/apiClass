const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  otp:{
    type: String,
  },
  otpExpiry:{
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("account", accountSchema);
