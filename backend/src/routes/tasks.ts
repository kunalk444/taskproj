import { Router } from "express";
import { Request,Response } from "express";
import {changeprioritystatus, deleteNotifs, displayNotifs, getinsideTaskInfo, handledelete, metadatabyme, metataskinfo, saveTask} from "../controllers/tasks" 
import { userModel } from "../models/usermodel";
import TaskModel from "../models/taskModel";
import { getIO } from "../services/socket";

const taskRouter = Router();

taskRouter.post("/createtask",async(req:Request & { user?: any },res:Response)=>{
    const io = getIO();
    const obj = req.body;
    const assignedBy = req.user.userObj.id;
    const save = await saveTask({...obj,assignedBy});
    //const assignedByMeTasks = await metataskinfo(id);
    const rec = save.assignedTo;
    if(rec && save){
        io.to(rec.toString()).emit("task-assigned",{
            taskName:obj.title,
            taskId:save.id,
            type:"you were assigned a new task:"
        });
    }
    if(save)return res.status(200).json({success:true});
    return res.status(401).json({success:false});
})

taskRouter.get("/metainfo",async(req:Request & { user?: any },res:Response)=>{
    const id = req.user.userObj.id;
    const email = req.user.userObj.email;
    const metadata = await metataskinfo(id,email);
    return res.status(200).json({metadata}); 
})

taskRouter.get("/metainfoassignedbyme",async(req:Request & { user?: any },res:Response)=>{
    const id = req.user.userObj.id;
    const metadata = await metadatabyme(id);
    return res.status(200).json({metadata}); 
})

taskRouter.get("/getinsidetask",async(req:Request & { user?: any },res:Response)=>{
    const taskId = req.query.id;
    const data = await getinsideTaskInfo(String(taskId));
    if(data){
        return res.status(200).json({"success":true,task:data});
    } 
    return res.status(400).json({"success":false});
});

taskRouter.patch("/changepriorityorstatus",async(req:Request & { user?: any },res:Response)=>{
    const io = getIO();
    const {id,priority,status} = req.body;
    const data = await changeprioritystatus(id,priority,status);
    if(!data)return res.status(400).json({"success":false});

    
    if(data.assignedTo){
        io.to(data.assignedTo?.toString()).emit("task-updated",{
        taskId:data._id,
        taskName:data.title,
        type:"Changes were made in priority or status"
        }); 
    }

    if(data.assignedBy){
        io.to(data.assignedBy?.toString()).emit("task-updated",{
        taskId:data._id,
        taskName:data.title,
        type:"Changes were made in priority or status"
        }); 
    }

    return res.status(200).json({"success":true,task:data});

});

taskRouter.post("/notifications",async(req:Request,res:Response)=>{
    const {id} = req.body;
    const ans = await displayNotifs(id);
    return res.status(200).json({success:true,arr:ans})
})

taskRouter.post("/deletenotifs",async(req:Request,res:Response)=>{
    const {id} = req.body;
    const ans = await deleteNotifs(id);
    if(ans.success)return res.status(200).json({success:true})
    return res.status(400).json({success:false});
})

taskRouter.post("/deletetask",async(req:Request,res:Response)=>{
    const {taskId} = req.body;
    const ans = await handledelete(taskId);
    if(ans.success)return res.status(200).json({success:true})
    return res.status(400).json({success:false});
})

export default taskRouter;