const { productValidation } = require("../middleware/joivalidation");
const authSchema = require("../model/authModel");
const productSchema = require("../model/productModel");
const cloudinary = require("../config/cloudinary");

const checkUserLoggedIn = (req, res) => {
  if (!req.user) {
    res.status(401).json({
      message: "Access Denied, you are not logged in",
      success: false,
    });
    return false;
  }
  return true;
};

const checkAdminRole = async (userId, res) => {
  const checkAdmin = await authSchema.findOne({ _id: userId });
  if (checkAdmin.role !== "admin") {
    res.status(401).json({
      message: "Unauthorized. You are not an admin",
      success: false,
    });
    return false;
  }
  return checkAdmin;
};

const validateProduct = (req, res) => {
  const { error } = productValidation(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message, success: false });
    return false;
  }
  return true;
};

const checkFilesUploaded = (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400).json({
      message: "Image files not found. Please upload at least one image.",
      success: false,
    });
    return false;
  }
  return true;
};

const uploadImages = async (files) => {
  const images = [];
  const fileArray = files.slice(0, 4); // Limit to first 4 images
  for (const file of fileArray) {
    const uploadedImage = await cloudinary.uploader.upload(file.path);
    images.push(uploadedImage.secure_url);
  }
  return images;
};

const addpost = async (req, res) => {
  try {
    if (!checkUserLoggedIn(req, res)) return;

    const userId = req.user.id;
    const checkAdmin = await checkAdminRole(userId, res);
    if (!checkAdmin) return;

    if (!validateProduct(req, res)) return;

    if (!checkFilesUploaded(req, res)) return;

    const { title, price, description, category } = req.body;
    let images;
    try {
      images = await uploadImages(req.files);
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

module.exports = addpost;