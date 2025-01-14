const express = require("express");
const app = express();
require("dotenv").config()
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const allRoutes = require("./routes/userRoute")
const fileupload = require("express-fileupload");
const MONGODB = process.env.MONGODB_URL;
mongoose.connect(MONGODB).then(()=>{
    console.log("DB connected successfully");
}).catch((error)=>{
    console.log(error);
})
app.use(express.static("public"))
app.use(cookie())
app.use(fileupload())
app.use(express.urlencoded({ extended:true}))
app.use(express.json());

app.use("/api/vp1", allRoutes)
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})