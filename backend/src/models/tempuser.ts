import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
});


export type TempUser = mongoose.InferSchemaType<typeof tempUserSchema>;
export const TempUserModel = mongoose.model<TempUser>("TempUser", tempUserSchema);