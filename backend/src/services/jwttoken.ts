import jwt, { JwtPayload } from "jsonwebtoken";
import 'dotenv/config';

const secret=String(process.env.JWT_SECRET);

interface User{name:string,id:string,email:string}

export const createJwtToken=(user:{email:string,id:string,name:string})=>{
    try{
    const token=jwt.sign(user,secret);
    return token;
    }catch(err){
        console.log("error:",err)
    }
}
export const verifyToken=(token:string|undefined)=>{
    try{
    if(token===undefined)return {success:false};
    const userObj=jwt.verify(token,secret);
    if(userObj)return {success:true,userObj};
    return {success:false};
    }catch(err){
        console.log("error:",err)
        return null;
    }
}
