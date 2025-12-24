import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpMail(email: string, otp: string) {
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
