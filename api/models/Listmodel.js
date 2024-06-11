const mongoose = require("mongoose")

const ListSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    offer:{
       type:Boolean
    },
    price:{
       type:Number,
       required:true
    },
    discountprice:{
       type:Number,
       required:false
    },
    imageURLs:{
        type:Array,
        required:true
    },
     phone:{
        type:Number,
        required:true
    },
    rating:{
        type:Array,
        default:[]
    },
    userEmail:{
        type:Array,
        default:[]
    },
    totalReview:{
        type:Number,
        default:0
    }

},{timestamps:true})

const List = mongoose.model("Lists",ListSchema)

module.exports = List