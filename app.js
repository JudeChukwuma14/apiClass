const express = require("express");
const app = express();
require("dotenv").config()
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const allRoutes = require("./routes/userRoute")
const path = require("path");
const expressfileupload = require("express-fileupload");
const cors = require("cors");
const MONGODB = process.env.MONGODB_URL;
mongoose.connect(MONGODB).then(()=>{
    console.log("DB connected successfully");
}).catch((error)=>{
    console.log(error);
})
app.use("/public", express.static(path.join(__dirname, "public")))
app.use(expressfileupload())
app.use(cookie())
app.use(express.urlencoded({ extended:true}))
app.use(express.json());

app.use(cors({
    origin:"https://jannode.onrender.com",
    credentials:true,
    methods:["GET", "POST", "PUT", "DELETE"],
    }))

app.use("/api/vp1", allRoutes)
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})