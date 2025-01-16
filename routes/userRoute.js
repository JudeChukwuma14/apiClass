const express = require("express");
const { getText, getPostedProducts } = require("../controller/userController");
const {
  registerAccount,
  signinAccount,
} = require("../controller/authcontroller");

const { verifyToken } = require("../middleware/verifyToken");
const { postProduct, updateProduct } = require("../controller/adminController");
const router = express.Router();

router.get("/send", getText);
router.get("/getproduct", getPostedProducts)
router.post("/signup", registerAccount);
router.post("/signin", signinAccount);
router.patch("/update/:productId",verifyToken, updateProduct)
router.post("/products", verifyToken, postProduct);

module.exports = router;
