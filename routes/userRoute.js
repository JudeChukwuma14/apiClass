const express = require("express");
const { getText, getPostedProducts } = require("../controller/userController");
const {
  registerAccount,
  signinAccount,
  forgetPassword,
  verifyOtp,
  resetPassword,
} = require("../controller/authcontroller");

const { verifyToken } = require("../middleware/verifyToken");
const { postProduct, updateProduct, deleteProduct } = require("../controller/adminController");
const router = express.Router();

router.get("/send", getText);
router.get("/getproduct", getPostedProducts)
router.post("/signup", registerAccount);
router.post("/signin", signinAccount);
router.patch("/update/:productId",verifyToken, updateProduct)
router.delete("/delete/:productId", verifyToken, deleteProduct);
router.post("/products", verifyToken, postProduct);
router.post("/forgetpassword", forgetPassword)
router.post("/verrifyotp", verifyOtp)
router.post("/resetpassword/:otp", resetPassword)

module.exports = router;
