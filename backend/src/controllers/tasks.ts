import mongoose from "mongoose";
import TaskModel from "../models/taskModel"
import { Task } from "../models/taskModel";
import { userModel } from "../models/usermodel";

export const saveTask = async(taskInfo:Task)=>{
    console.log(taskInfo);
    const user = await userModel.findOne({email:taskInfo.assignedToEmail});
    if(user)taskInfo.assignedTo = user._id;
    const task = await TaskModel.create(taskInfo);
    if(task)return {success:true};
    return {success:false};
} 

export const metataskinfo = async(id:string) =>{
    const tasks = await TaskModel.find(
        {
            assignedTo:new mongoose.Types.ObjectId(id)
        }
    ).populate("assignedBy","name").lean();
    if(!tasks)return [];
    const assignedByNames = tasks.map((element)=>((element.assignedBy as any)?.name));
    let cnt = 0;
    return tasks.map(element => ({
            id:element._id,
            dueDate:element.dueDate,
            assignedBy:(cnt<assignedByNames.length?assignedByNames[cnt++]:"unknown"),
            priority:element.priority,
            title:element.title
    }));
}

export const metadatabyme = async(id:string)=>{
    const tasks = await TaskModel.find({
        assignedBy : new mongoose.Types.ObjectId(id)
        },{
            _id:1,
            dueDate:1,
            priority:1,
            title:1
        }
        )
        .populate("assignedTo","name").lean();
    console.log(tasks);
    const data = tasks.map(item => ({
        ...item,
        assignedTo: (item.assignedTo as any)?.name
    }));
    
    console.log("after:",data);
    
    return data;
}