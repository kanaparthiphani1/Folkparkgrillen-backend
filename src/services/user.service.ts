import User from "../models/Users";
import bcrypt from "bcrypt";
import { getOtp, sendOtpMail } from "../utils/helpers";

export async function signupwithemailService(email: string, password: string) {
  try {
    //get a 4 dig code and shoot a email with otp
    const otp = getOtp().toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const user = await User.create({
      email: email,
      password: password,
      role: "USER",
      verificationDetails: {
        verificationState: "NOT_VERIFIED",
        code: hashedOtp,
        generatedAt: new Date(),
      },
    });

    await sendOtpMail(email, otp);
    return user.toJSON();
  } catch (err) {
    throw err;
  }
}

export async function verifyOtpService(userId: string, otp: string) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.verificationDetails.verificationState !== "NOT_VERIFIED") {
      throw new Error("User already verified");
    }

    const currentDate = new Date();
    const generatedAt = new Date(user.verificationDetails.generatedAt);
    if (currentDate.valueOf() - generatedAt.valueOf() > 30 * 60 * 100) {
      throw new Error("OTP expired");
    }

    const isValid = await bcrypt.compare(otp, user.verificationDetails.code);
    if (!isValid) {
      throw new Error("Invalid OTP");
    }

    user.verificationDetails.verificationState = "VERIFIED";
    user.verificationDetails.code = "";
    await user.save();
    return user.toJSON();
  } catch (error) {
    throw error;
  }
}
