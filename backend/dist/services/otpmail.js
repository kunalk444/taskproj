"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpMail = sendOtpMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendOtpMail(email, otp) {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "kanjwanikunal43@gmail.com",
            pass: "eeuq otdu somn ckuf"
        }
    });
    (async () => {
        const msg = await transporter.sendMail({
            from: '"Kunal Kanjwani"<kanjwanikunal43@gmail.com>',
            to: email,
            subject: "OTP for sign-up by Kunal-Task-Management System",
            text: `Your one-time password (OTP) is ${otp}. Please use this code to complete your verification process within the next 1:30 minutes. If you did not request this code, please ignore this email.`
        });
        console.log("msg sent:", msg.messageId);
    })();
}
