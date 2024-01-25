import { mailerSender } from "../configs/nodeMailer.configs";

export function getOtp() {
  return Math.floor(Math.random() * 9000 + 1000);
}

export async function sendOtpMail(address: string, code: string) {
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: address,
    subject: "OTP Verification",
    html: `Your OTP is ${code}`,
  };
  await mailerSender.sendMail(mailOptions);
}
