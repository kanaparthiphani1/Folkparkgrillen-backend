import { StatusCodes } from "http-status-codes";
import { SignupMobileInput } from "../schemas/signup_mobile.schema";
import {
  signupwithemailService,
  verifyOtpService,
} from "../services/user.service";
import AppError from "../utils/app-error";
import { SignupEmailInput } from "./../schemas/signup_email.schema";
import { Request, Response } from "express";

export async function signupwithemail(
  req: Request<{}, {}, SignupEmailInput["body"]>,
  res: Response
) {
  try {
    const { email, password } = req.body;
    const user = await signupwithemailService(email, password);
    return res.status(200).json({ userId: user?._id });
  } catch (err: any) {
    console.log("Err 1: ", err);

    return res.status(err.statusCode).json(err);
  }
}

export async function verifyOtpWithEmail(req: Request, res: Response) {
  try {
    const { userId, otp } = req.body;
    const user = await verifyOtpService(userId, otp);
    return res.status(200).json({ userId: user?._id });
  } catch (err: any) {
    return res.status(err.statusCode).json(err);
  }
}

function signupwithmobile(
  req: Request<{}, {}, SignupMobileInput["body"]>,
  res: Response
) {}
