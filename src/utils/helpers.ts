import { Response } from "express";
import mailerSender from "../configs/nodeMailer.configs";
import path from "path";

export function getOtp() {
  return Math.floor(Math.random() * 9000 + 1000);
}

export async function sendOtpMail(address: string, code: string) {
  console.log(path.join(path.dirname(__dirname), "images", "instagram2x.png"));

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: address,
    subject: "OTP Verification",
    template: "otp",
    context: {
      user: address.split("@")[0],
      code: code,
    },
    attachments: [
      {
        filename: "facebook2x.png",
        path: path.join(path.dirname(__dirname), "images", "facebook2x.png"),
        cid: "facebook2x", // Content-ID for the embedded image
      },
      {
        filename: "instagram2x.png",
        path: path.join(path.dirname(__dirname), "images", "instagram2x.png"),
        cid: "instagram2x", // Content-ID for the embedded image
      },
    ],
  };

  await mailerSender.sendMail(mailOptions);
}
