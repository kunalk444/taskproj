import mongoose from "mongoose";
import TaskModel from "../models/taskModel"
import { Task } from "../models/taskModel";
import { userModel } from "../models/usermodel";
import { assign } from "nodemailer/lib/shared";

export const saveTask = async(taskInfo:Task)=>{
    const user = await userModel.findOne({email:taskInfo.assignedToEmail});
    if(user){
        taskInfo.assignedTo = user._id;
    }
    const task = await TaskModel.create(taskInfo);
    if(task)return {success:true,assignedTo:user?._id||null,id:task._id};
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
   
    const data = tasks.map(item => ({
        ...item,
        assignedTo: (item.assignedTo as any)?.name
    }));
    
    console.log("after:",data);
    
    return data;
}

export const getinsideTaskInfo=async(taskId:string)=>{
    if(taskId==null)return null;
    const task = await TaskModel.findById(taskId);
    if(task)return task;
    return null;
}

export const changeprioritystatus = async(id:string,priority:string,status:string)=>{
    if(id==null||priority==null||status==null)return null;
    const data = await TaskModel.findByIdAndUpdate(id,{
            priority,
            status,
        },
        { new: true, runValidators: true }
    );
    return data;
}