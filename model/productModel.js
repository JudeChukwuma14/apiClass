
const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId, ref:"account"
    },
    images:[{type:String}],
    date:{
        type: Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("product", productSchema)