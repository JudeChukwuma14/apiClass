const express = require("express");
const { getText } = require("../controller/userController");
const {
  registerAccount,
  signinAccount,
} = require("../controller/authcontroller");

const { verifyToken } = require("../middleware/verifyToken");
const { postProduct } = require("../controller/adminController");
const addpost = require("../controller/add");
const uploading = require("../config/multer");
const router = express.Router();

router.get("/send", getText);
router.post("/signup", registerAccount);
router.post("/signin", signinAccount);
router.post("/product", verifyToken,uploading, postProduct);
router.post("/products", verifyToken,uploading, addpost);

module.exports = router;
