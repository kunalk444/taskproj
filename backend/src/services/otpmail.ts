import nodemailer from "nodemailer";

export async function sendOtpMail(email:string,otp:String){
    const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:"kanjwanikunal43@gmail.com",
            pass:"eeuq otdu somn ckuf"
        }
    });

    (async()=>{
        const msg=await transporter.sendMail({
            from:'"Kunal Kanjwani"<kanjwanikunal43@gmail.com>',
            to:email,
            subject:"OTP for sign-up by Kunal-Task-Management System",
            text:`Your one-time password (OTP) is ${otp}. Please use this code to complete your verification process within the next 1:30 minutes. If you did not request this code, please ignore this email.`
        });
        console.log("msg sent:",msg.messageId);
    })();
}
