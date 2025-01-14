const { productValidation } = require("../middleware/joivalidation");
const authSchema = require("../model/authModel");
const productSchema = require("../model/productModel");
const cloudinary = require("../config/cloudinary");

const postProduct = async (req, res) => {
  try {
    if (req.user) {
      const filepath = req.imageArr;
      const accountid = req.user.id;
      const check = await authSchema.findOne({ _id: accountid });
      if (check.role === "admin") {
        const { error } = productValidation(req.body);
        if (error) {
          return res
            .status(400)
            .json({ message: error.details[0].message, success: false });
        }

        const { title, price, description, category } = req.body;

        await productSchema.create({
          title: title,
          price: price,
          postedBy: check._id,
          description: description,
          category: category,
          images: images,
        });

        return res
          .status(201)
          .json({ message: "Upload successful", success: true });
      } else {
        return res.status(401).json({
          message: "Unauthorized,You are not an admin",
          success: false,
        });
      }
    } else {
      return res.status(401).json({
        message: "Access Denied, you are not logged in",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Error occured !",
      success: false,
      error: err.message,
    });
  }
};

module.exports = { postProduct };
