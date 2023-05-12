import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true
        
    },
    email:{
        type:String,
        required:true,
        unique:true
        
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0,
    },
    favourit:{
        type:String,
        required:true
    },
    address:{
        type:{},
    },
    tooken:{
        type:String,
    },
},{timestamps:true})

export default mongoose.model('users', userSchema)