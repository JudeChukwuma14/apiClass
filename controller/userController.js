const productSchema = require("../model/productModel");
const getText = (req, res) => {
  try {
    const hostname = `${req.protocol}://${req.get("host")}`;
    return res.send(
      `Welcome to the user route, you can get the text from the url ${hostname}`
    );
  } catch (error) {
    res.status(500);
    console.log(error.message);
  }
};

const getPostedProducts = async (req, res) => {
  try {
    const products = await productSchema.find().populate("postedBy");
    if (products.length === 0 || !products) {
      return res.status(404).json({
        message: "No products found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Products found successfully",
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500);
    console.log(error.message);
  }
};

module.exports = { getText, getPostedProducts };
