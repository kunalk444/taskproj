import mongoose from "mongoose";
import TaskModel from "./taskModel";

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

userSchema.post("save",async function(){
    const user = this;
    const demo = await TaskModel.create({
        title:"Demo task",
        description:`Just continue being amazing ${user.name}😊`,
        assignedBy:new mongoose.Types.ObjectId("000000000000000000000001"),
        assignedTo:user._id,
        status:'In Progress',
        priority:'Urgent',
        dueDate:new Date(Date.now() + 86400*1000)
    });
});


export type User = mongoose.InferSchemaType<typeof userSchema>;
export const userModel = mongoose.model<User>("User", userSchema);