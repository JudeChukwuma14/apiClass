const { productValidation } = require("../middleware/joivalidation");
const authSchema = require("../model/authModel");
const productSchema = require("../model/productModel");
const { v4: uuidv4 } = require("uuid");

const postProduct = async (req, res) => {
  try {
    if (req.user) {
      const accountid = req.user.id;
      const check = await authSchema.findOne({ _id: accountid });
      if (check.role === "admin") {
        const { error } = productValidation(req.body);
        if (error) {
          return res
            .status(400)
            .json({ message: error.details[0].message, success: false });
        }
        if (!req.files) {
          return res.status(400).json({
            message: "Please upload an image",
            success: false,
          });
        }
        const images = req.files.images;
        if (!Array.isArray(images)) {
          return res.status(400).json({
            message: "Please upload multiple images",
            success: false,
          });
        }
        const hostname = `${req.protocol}://${req.get("host")}`;
        let imageArray = [];
        await Promise.all(
          images.map(async (item) => {
            const imageID = uuidv4();
            const imageExtension = item.name.split(".").pop();
            const newImageName = `${imageID}.${imageExtension}`;
            const imagePath = `${hostname}/public/uploads/${newImageName}`;
            imageArray.push(imagePath);
            const imageDr = `public/uploads/${newImageName}`;
            await item.mv(imageDr);
          })
        );
        const { title, description, price, category } = req.body;
        await productSchema.create({
          title: title,
          description: description,
          price: price,
          category: category,
          images: imageArray,
          postedBy: check._id,
        });
        return res.status(200).json({
          message: "Product added successfully",
          success: true,
        });
      } else {
        return res.status(401).json({
          message: "Access Denied, you are not an admin",
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

const updateProduct = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const check = await authSchema.findOne({ _id: userId });
      if (check.role === "admin") {
        const updateId = req.params.productId;
        const checkProduct = await productSchema.findOne({productId:updateId});
        console.log(checkProduct);
        if (!checkProduct) {
          return res
            .status(404)
            .json({ message: "Product not found", success: false });
        }
        const { title, description, price, category } = req.body;
        if (title) {
          checkProduct.title = title;
        }
        if (description) {
          checkProduct.description = description;
        }
        if (price) {
          checkProduct.price = price;
        }
        if(category){
          checkProduct.category = category;
        }
        await checkProduct.save();
        return res.status(200).json({
          message: "Product updated successfully",
          success: true,
        });
      } else {
        return res.status(401).json({
          message: "Access Denied, you are not an admin",
          success: false,
        });
      }
    } else {
      return res.status(401).json({
        message: "Access Denied, you are not logged in",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error occured !",
      success: false,
      error: error.message,
    });
  }
};
module.exports = { postProduct, updateProduct };
