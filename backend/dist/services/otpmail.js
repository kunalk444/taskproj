"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpMail = sendOtpMail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendOtpMail(email, otp) {
    const { data, error } = await resend.emails.send({
        from: "Taskque-Kunal Kanjwani <onboarding@resend.dev>",
        to: email,
        subject: "OTP for sign-up by Kunal-Task-Management System",
        text: `Your one-time password (OTP) is ${otp}. Please use this code to complete your verification process within the next 1:30 minutes.`
    });
    if (error) {
        console.error("Email send failed:", error);
        throw new Error("Failed to send OTP email");
    }
    console.log("msg sent:", data.id);
}
