const { productValidation } = require("../middleware/joivalidation");
const authSchema = require("../model/authModel");
const productSchema = require("../model/productModel");
const cloudinary = require("../config/cloudinary");

const postProduct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Access Denied, you are not logged in",
        success: false,
      });
    }

    const userId = req.user.id;
    const checkAdmin = await authSchema.findOne({ _id: userId });

    if (checkAdmin.role !== "admin") {
      return res.status(401).json({
        message: "Unauthorized. You are not an admin",
        success: false,
      });
    }

    const { error } = productValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Image files not found. Please upload at least one image.",
        success: false,
      });
    }

    const { title, price, description, category } = req.body;
    const images = [];

    try {
      // Use req.files directly (it is already an array)
      const fileArray = req.files.slice(0, 4); // Limit to first 4 images
      for (const file of fileArray) {
        const uploadedImage = await cloudinary.uploader.upload(file.path);
        images.push(uploadedImage.secure_url);
      }
    } catch (cloudinaryError) {
      return res.status(500).json({
        message: "Failed to upload images to Cloudinary",
        success: false,
        error: cloudinaryError.message,
      });
    }

    // Save product to the database
    await productSchema.create({
      title,
      price,
      description,
      category,
      postedBy: checkAdmin._id,
      images: images,
    });

    return res.status(200).json({
      message: "Product posted successfully",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Oops! An error occurred.",
      success: false,
      error: error.message,
    });
  }
};

module.exports = { postProduct };
