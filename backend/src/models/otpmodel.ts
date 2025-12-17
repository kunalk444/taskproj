import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        default:"xyz"
    },
    otp:{
        type:String,
        required:true,
        index:true,
    },
    password:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true,
    }
},{
    timestamps:true
})
otpSchema.index({expiresAt:1},{expireAfterSeconds:5});


export const otpModel = mongoose.model("otp",otpSchema);