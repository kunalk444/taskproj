import { Router, Request, Response } from "express";
import { hashPassword, verifyPassword } from "../services/hashing";
import { userModel } from "../models/usermodel";
import { createJwtToken, verifyToken } from "../services/jwttoken";
import { OAuth2Client } from "google-auth-library";
import { TempUserModel } from "../models/tempuser";


const authRouter = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface userData {
    email: string,
    name: string,
    password: string
}

authRouter.post("/googleuser", async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });

        const data = await ticket.getPayload();
        if (!data) return res.status(400).json({ success: false });
        if (!data.name || !data.email) return res.status(400).json({ success: false });
        let user = await userModel.findOne({ email:data.email });
        if(user){
            const cookieToken = createJwtToken({ email:user.email, id: String(user._id), name: user.name });
            res.cookie("jwt", cookieToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 2
            });
            return res.status(200).json({ success: true, alreadyAUser:true,name: user.name, email: user.email,id:user._id });
        }
        if (data.email_verified) return res.status(200).json({ success: true, name: data.name, email: data.email });
        return res.status(401).json({ success: false });
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ success: false });
    }
});

authRouter.post("/googleuserfinal", async (req: Request, res: Response) => {
    try {
        const { email, name, password }: userData = req.body;

        let user = await userModel.findOne({ email });
        if (user) {
            const cookieToken = createJwtToken({ email, id: String(user._id), name: user.name });
            res.cookie("jwt", cookieToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 2
            });
            return res.status(200).json({ success: true, name: user.name, email: user.email, id: user._id });
        }
        const hashedPassword = await hashPassword(password);
        user = await userModel.create({
            email,
            name,
            password: hashedPassword,
        });
        const cookieToken = createJwtToken({ email, id: String(user._id), name: user.name });
        res.cookie("jwt", cookieToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 2
        });

        return res.status(200).json({ success: true, name: user.name, email: user.email, id: user._id });
    } catch (err) {
        return res.status(400).json({ "error": err });
    }
});


authRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const { email, name, password }: userData = req.body;
        const hashedPassword = await hashPassword(password);
        const already = await userModel.findOne({email});
        if (already) return res.status(400).json({success:false,message:"User already exists!"});
        const user = await userModel.create({
            email,
            name,
            password: hashedPassword,
        });
        if(!user)return res.status(400).json({success:false});
        const cookieToken = createJwtToken({ email:user.email, id: String(user._id), name: user.name });
        res.cookie("jwt", cookieToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 2
        });

        return res.status(200).json({ success: true, name: user.name, email: user.email, id: user._id });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "error": err });
    }
});


authRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        const user = await userModel.findOne({ email });
        const ifSame: boolean = await verifyPassword(password, String(user?.password));
        if (!ifSame || !user) return res.status(400).json({ success: false });
        const cookieToken = createJwtToken({ email, id: String(user._id), name: user.name });
        res.cookie("jwt", cookieToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 2
        });
        return res.status(200).json({ success: true, name: user?.name, id: user._id, email: user.email });
    } catch (err) {
        return res.status(500).json({ "error": err });
    }
})

authRouter.post("/logout",(req: Request, res: Response) => {
    res.clearCookie("jwt",{
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });
    return res.status(200).json({success:true});
})

authRouter.get("/verifyuser", async (req: Request, res: Response) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(400).json({ msg: "No token" });

  const data = verifyToken(String(token));
  if (!data) return res.status(400).json({ msg: "Invalid token" });

  if (typeof data.userObj !== "object")
    return res.status(401).json({ msg: "Unauthorized" });

  const user = await userModel.findById(data.userObj?.id);
  if (!user) return res.status(401).json({ msg: "User not found" });

  return res.status(200).json(data);
});

export default authRouter;