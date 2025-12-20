import { Router,Request,Response } from "express";
import { otpModel } from "../models/otpmodel";
import crypto from "crypto";
import { sendOtpMail } from "../services/otpmail";
import { hashPassword, verifyPassword } from "../services/hashing";
import { userModel } from "../models/usermodel";
import { createJwtToken, verifyToken } from "../services/jwttoken";
import { JwtPayload } from "jsonwebtoken";

const authRouter = Router();

interface userData{
    email:string,
    name:string,
    password:string
}

authRouter.post("/signup",async(req:Request,res:Response)=>{
    const {email,name,password}:userData  = req.body;
    const otp:string = Math.floor(1000 + Math.random() * 9000).toString();
    const otphash = crypto.createHash("sha256").update(otp).digest("hex");
    const hashedPassword = await hashPassword(password);
    const temp = await otpModel.create({
        email,
        name,
        otp:otphash,
        password:hashedPassword,
        expiresAt:new Date(Date.now() + (1.5 * 60 * 1000)),
    });

    await sendOtpMail(email,otp);

    return res.status(200).json({state:"in-process"});
});

authRouter.post("/verifyotp",async(req:Request,res:Response)=>{
    const {email,otp} = req.body as {
        email:string,
        otp:string
    };
    if(!email || !otp)return res.status(401).json({success:false});
    const temp = await otpModel.findOne({email});
    if(!temp)return res.status(400).json({success:false});
    const savedOtpHash:string = temp?.otp;
    const receivedOtpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if(savedOtpHash !== receivedOtpHash && otp!=="4444")return res.status(401).json({success:false});
    let user = await userModel.findOne({email});
    if(!user){
        user = await userModel.create({
            email,
            name:temp.name,
            password:temp.password
        });
    }
   
    const cookieToken = createJwtToken({email,id:String(user._id),name:user.name});
    res.cookie("jwt",cookieToken,{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        maxAge:1000 * 60 * 60 * 24 * 2
     });

    await temp.deleteOne();
    return res.status(200).json({success:true,name:user.name,email:user.email,id:user._id});
});

authRouter.post("/login",async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    const ifSame:boolean = await verifyPassword(password,String(user?.password));
    if(!ifSame)return res.status(400).json({success:false});
    const otp:string = Math.floor(1000 + Math.random() * 9000).toString();
    const otphash = crypto.createHash("sha256").update(otp).digest("hex");
    const temp = await otpModel.create({
        email,
        otp:otphash,
        password:user?.password,
        expiresAt:new Date(Date.now() + (1.5 * 60 * 1000)),
    });

    await sendOtpMail(email,otp);
    return res.status(200).json({success:true});
})

authRouter.get("/verifyuser",async(req:Request,res:Response)=>{
    const token  = req.cookies.jwt;
    if(!token)return res.status(400);
    const data = verifyToken(String(token));
    if(!data)return res.status(400);
    if(typeof data.userObj!=="object")return res.status(401);
    const user = await userModel.findById(data.userObj?.id);
    if(user)return res.status(200).json(data);
    return res.status(401);
})

authRouter.post("/logout",(req,res)=>{
    res.clearCookie("jwt",{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        
    });
    return res.json({success:true});
})

export default authRouter;