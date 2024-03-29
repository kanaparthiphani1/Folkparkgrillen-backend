import { StatusCodes } from "http-status-codes";
import {
  forgotPasswordService,
  resetPasswordService,
  signinService,
  signupService,
  updateProfileService,
  verifyOtpService,
} from "../services/user.service";
import { SignupEmailInput } from "./../schemas/signup_email.schema";
import { Request, Response } from "express";
import { SignInInput } from "../schemas/signin_email.schema";
import { signJwt } from "../utils/jwt.utils";

export async function signup(
  req: Request<{}, {}, SignupEmailInput["body"]>,
  res: Response
) {
  try {
    const { email, password } = req.body;
    const user = await signupService(email, password);
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

export async function signin(
  req: Request<{}, {}, SignInInput["body"]>,
  res: Response
) {
  try {
    const { email, password } = req.body;
    const user = await signinService(email, password);
    const accessToken = signJwt(
      { userId: user._id },
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
    const refreshToken = signJwt(
      { userId: user._id },
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
    });

    return res.status(StatusCodes.OK).json({ user: user._id });
  } catch (err: any) {
    console.log("ERROR 11: ", err);

    return res.status(err.statusCode).json(err);
  }
}

export async function signout(req: Request, res: Response) {
  res.cookie("accessToken", null, {
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", null, {
    expires: new Date(Date.now()),
  });
  return res
    .status(StatusCodes.OK)
    .json({ message: "Successfully signed out" });
}

//TODO: need to create schema validation
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const resetlink = `${req.protocol}://${req.hostname}/api/v1/user/resetpassword/`;
    await forgotPasswordService(email, resetlink);
    return res.status(StatusCodes.OK).json({ message: "mail has been sent" });
  } catch (err: any) {
    return res.status(err.statusCode).json(err);
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const token = req.params.token;
    const { password, confPassword } = req.body;
    await resetPasswordService(token, password, confPassword);
    return res
      .status(StatusCodes.OK)
      .json({ message: "password reset successful" });
  } catch (err: any) {
    return res.status(err.statusCode).json(err);
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = res.locals.user.userId;
    const userProfilePicPath = req.file?.path;
    const user = await updateProfileService(
      userId,
      req.body,
      userProfilePicPath || ""
    );
    return res.status(StatusCodes.OK).json({ user });
  } catch (err: any) {
    return res.status(err.statusCode).json(err);
  }
}
