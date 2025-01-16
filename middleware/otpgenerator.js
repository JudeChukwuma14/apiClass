const authSchema = require("../model/authModel");
const crypto = require("crypto");

const otpGenerator = async (email) => {
  let timestamp = Date.now();
  let date = new Date().toDateString();
  let hash = crypto
    .createHash("sha256")
    .update(email + timestamp + date)
    .digest("hex");

  let otp = hash.substring(0, 6);
  let checkOtp = await authSchema.findOne({ otp: otp });
  while (checkOtp) {
    let timestamp = Date.now();
    let date = new Date().toDateString();
    let hash = crypto
      .createHash("sha256")
      .update(email + timestamp + date)
      .digest("hex");

    let otp = hash.substring(0, 6);
    let checkOtp = await authSchema.findOne({ otp: otp });
  }
  return otp;
};

module.exports = otpGenerator;
