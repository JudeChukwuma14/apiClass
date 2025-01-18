const MailSendig = require("../middleware/emaiSetup");
const { createAccount, loginAccount } = require("../middleware/joivalidation");
const otpGenerator = require("../middleware/otpgenerator");
const authSchema = require("../model/authModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerAccount = async (req, res) => {
  try {
    const { error } = createAccount(req.body);
    if (error) {
      return res
        .status(401)
        .json({ message: error.details[0].message, success: false });
    }
    const { username, email, password, retypePassword } = req.body;
    if (password !== retypePassword) {
      return res
        .status(401)
        .json({ message: "Mismatch password", success: false });
    }
    const checkEmail = await authSchema.findOne({ email: email });
    if (checkEmail) {
      return res
        .status(409)
        .json({ message: "Email already exist", success: false });
    }
    const hashpassword = bcryptjs.hashSync(password, 10);
    await authSchema.create({
      username: username,
      email: email,
      password: hashpassword,
    });
    return res.status(200).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Oops!! an error occured",
      success: false,
      error: error.message,
    });
  }
};

const signinAccount = async (req, res) => {
  try {
    const { error } = loginAccount(req.body);
    if (error) {
      return res
        .status(401)
        .json({ message: error.details[0].message, success: false });
    }
    const { email, password } = req.body;
    const checkUser = await authSchema.findOne({ email: email });
    if (!checkUser) {
      return res
        .status(409)
        .json({ message: "Email and Password Mismatch", success: false });
    }
    const checkPassword = bcryptjs.compareSync(password, checkUser.password);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ message: "Wrong credentials", success: false });
    }
    const token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, { expiresIn: "1hr", httpOnly: true })
      .status(200)
      .json({ message: "logged in sccussfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Oops!!! an error occured",
      success: false,
      error: error.message,
    });
  }
};
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(401)
        .json({ message: "Email is required", success: false });
    }
    const checkEmail = await authSchema.findOne({ email: email });
    if (!checkEmail) {
      return res
        .status(404)
        .json({ message: "Email not found", success: false });
    }
    const otp = await otpGenerator(email);
    checkEmail.otp = otp;
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    checkEmail.otpExpiry = date;

    const option = {
      email: email,
      subject: "Password Reset OTP",
      message: `Your OTP is ${otp} \n OTP expires in 10 minutes`,
    };
    await MailSendig(option);
    await checkEmail.save();
    return res.status(200).json({
      message: "OTP sent successfully check your email",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Oops!!! an error occured",
      success: false,
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res
        .status(401)
        .json({ message: "OTP is required", success: false });
    }
    const checkOtp = await authSchema.findOne({ otp: otp });
    if (!checkOtp) {
      return res.status(404).json({ message: "Invalid OTP", success: false });
    }
    const date = new Date();
    if (date >= checkOtp.otpExpiry) {
      return res
        .status(401)
        .json({ message: "OTP has expired", success: false });
    } else {
      return res
        .status(200)
        .json({ message: "OTP verified successfully", success: true });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Oops!!! an error occured",
      success: false,
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const otp = req.params.otp;
    if (!otp) {
      return res.status(401).json({
        message: "OTP is required, fail to reset password ",
        success: false,
      });
    }
    const { password, retypePassword } = req.body;
    if (
      !password ||
      !retypePassword ||
      password.trim() === "" ||
      retypePassword.trim() === ""
    ) {
      return res.status(401).json({
        message: "Please this field can not be empty",
        success: false,
      });
    }
    if (password !== retypePassword) {
      return res
        .status(401)
        .json({ message: "Mismatch password", success: false });
    }
    const checkOtp = await authSchema.findOne({ otp: otp });
    if (!checkOtp) {
      return res.status(404).json({
        message: "Invalid OTP, reset password failed",
        success: false,
      });
    }
    const date = new Date();
    if (date >= checkOtp.otpExpiry) {
      return res
        .status(401)
        .json({ message: "OTP has expired", success: false });
    } else {
      checkOtp.password = bcryptjs.hashSync(password, 10);
      checkOtp.otp = "";
      checkOtp.otpExpiry = "";
      await checkOtp.save();
      return res
        .status(200)
        .json({ message: "Password reset successfully", success: true });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Oops!!! an error occured",
      success: false,
      error: error.message,
    });
  }
};
module.exports = {
  registerAccount,
  signinAccount,
  forgetPassword,
  verifyOtp,
  resetPassword,
};
