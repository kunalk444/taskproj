import { Router } from "express";
import { Request,Response } from "express";
import {metadatabyme, metataskinfo, saveTask} from "../controllers/tasks" 
const taskRouter = Router();

taskRouter.post("/createtask",async(req:Request & { user?: any },res:Response)=>{
    const obj = req.body;
    const assignedBy = req.user.userObj.id;
    const save = await saveTask({...obj,assignedBy});
    if(save)return res.status(200).json({success:true});
    return res.status(401).json({success:false});
})

taskRouter.get("/metainfo",async(req:Request & { user?: any },res:Response)=>{
    const id = req.user.userObj.id;
    const metadata = await metataskinfo(id);
    return res.status(200).json({metadata}); 
})

taskRouter.get("/metainfoassignedbyme",async(req:Request & { user?: any },res:Response)=>{
    const id = req.user.userObj.id;
    const metadata = await metadatabyme(id);
    return res.status(200).json({metadata}); 
})

export default taskRouter;