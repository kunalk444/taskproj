import { Request,Response,NextFunction } from "express";
import { verifyToken } from "./services/jwttoken";

export const authmiddleware =(req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies?.jwt;
    const ifValid = verifyToken(token);
    if(!ifValid?.success)return res.status(401).json({msg:"some error occured!"});
    (req as Request & { user?: any }).user = ifValid;
    next();

}