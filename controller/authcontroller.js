const { createAccount, loginAccount } = require("../middleware/joivalidation");
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

module.exports = { registerAccount, signinAccount };
