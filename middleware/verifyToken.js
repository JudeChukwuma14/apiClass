const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Access Denied", success: false });
  }
  try {
    const isVerify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = isVerify;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "invalid token", success: false, error: error.message });
  }
};

module.exports = {verifyToken}