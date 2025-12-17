import { Router,Request,Response } from "express";
import { otpModel } from "../models/otpmodel";
import crypto from "crypto";
import { sendOtpMail } from "../services/otpmail";
import { hashPassword } from "../services/hashing";
import { userModel } from "../models/usermodel";

const authRouter = Router();

interface userData{
    email:string,
    password:string
}

authRouter.post("/signup",async(req:Request,res:Response)=>{
    const {email,password}:userData  = req.body;
    const otp:string = Math.floor(1000 + Math.random() * 9000).toString();
    const otphash = crypto.createHash("sha256").update(otp).digest("hex");
    const hashedPassword = await hashPassword(password);
    const temp = await otpModel.create({
        email,
        otp:otphash,
        password:hashedPassword,
        expiresAt:new Date(Date.now() + (1.5 * 60 * 1000)),
    });

    await sendOtpMail(email,otp);

    return res.status(200).json({state:"in-process"});
});

authRouter.post("/verifyotp",async(req:Request,res:Response)=>{
    const {email,otp} = req.body;
    console.log(email,otp);
    const temp = await otpModel.findOne({email});
    if(!temp)return res.status(400).json({success:false});
    const savedOtpHash:string = temp?.otp;
    const receivedOtpHash = crypto.createHash("sha256").update(otp).digest("hex");
    console.log(savedOtpHash);
    console.log(receivedOtpHash);

    if(savedOtpHash !== receivedOtpHash)return res.status(401).json({success:false});
    const user=await userModel.create({
        email,
        password:temp.password,
    })
    await temp.deleteOne();
    res.locals.user = user;
    return res.status(200).json({success:true});
});

export default authRouter;