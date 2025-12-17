import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    
});


export type User = mongoose.InferSchemaType<typeof userSchema>;
export const userModel = mongoose.model<User>("User", userSchema);