const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

const password = Math.random().toString(36).slice(-8)
const hashPasssword = bcryptjs.hashSync(password,10)
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
       default:hashPasssword
    },
    photo:{
        type:String
    },
    date:{
        type:Number,
        required:false
    }
    ,
    month:{
        type:Number,
        required:false
    },
    count:{
        type:Number,
        required:false
    },
    year:{
        type:Number,
        required:false
    }
},{timestamps:true})

const User = mongoose.model("user",userSchema)

module.exports = User