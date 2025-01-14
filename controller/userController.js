const getText = (req, res) => {
  try {
    res.status().json({ message: "Api is active" });
  } catch (error) {
    res.status(500);
    console.log(error.message);
  }
};

module.exports = { getText };
