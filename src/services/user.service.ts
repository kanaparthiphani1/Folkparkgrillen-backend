import User from "../models/Users";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  getOtp,
  isHex,
  sendOtpMail,
  sendPasswordResetMail,
} from "../utils/helpers";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import { uploadOnCloudinary } from "../utils/cloudinary";

export async function signupwithemailService(email: string, password: string) {
  try {
    //get a 4 dig code and shoot a email with otp
    const registered = await User.findOne({ email: email });
    if (registered) {
      throw new AppError("User already registered", StatusCodes.BAD_REQUEST);
    }

    const otp = getOtp().toString();
    const hashedOtp = await bcrypt.hash(otp, Number(process.env.SALT));

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
  } catch (err: any) {
    if (err.statusCode === StatusCodes.BAD_REQUEST) {
      throw err;
    }
    throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function verifyOtpService(userId: string, otp: string) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    if (user.verificationDetails.verificationState !== "NOT_VERIFIED") {
      throw new AppError("User already verified", StatusCodes.BAD_REQUEST);
    }

    const currentDate = new Date();
    const generatedAt = new Date(user.verificationDetails.generatedAt);
    if (currentDate.valueOf() - generatedAt.valueOf() > 30 * 60 * 100) {
      throw new AppError("OTP expired", StatusCodes.BAD_REQUEST);
    }

    const isValid = await bcrypt.compare(otp, user.verificationDetails.code);
    if (!isValid) {
      throw new AppError("Invalid OTP", StatusCodes.BAD_REQUEST);
    }

    user.verificationDetails.verificationState = "VERIFIED";
    user.verificationDetails.code = "";
    await user.save();
    return user.toJSON();
  } catch (err: any) {
    if (
      err.statusCode === StatusCodes.BAD_REQUEST ||
      err.statusCode === StatusCodes.NOT_FOUND
    ) {
      throw err;
    }
    throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function signinService(email: string, password: string) {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError("Invalid password", StatusCodes.BAD_REQUEST);
    }

    return user.toJSON();
  } catch (err: any) {
    console.log("ERROR: ", err);

    if (
      err.statusCode === StatusCodes.BAD_REQUEST ||
      err.statusCode === StatusCodes.NOT_FOUND
    ) {
      throw err;
    }
    throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function forgotPasswordService(email: string, link: string) {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    const resetToken = user.genForgotPasswordToken();

    await user.save({ validateBeforeSave: false });
    link = link + `${resetToken}`;
    await sendPasswordResetMail(user.email, link);
  } catch (err: any) {
    if (err.code === StatusCodes.NOT_FOUND) {
      throw err;
    }

    throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function resetPasswordService(
  token: string,
  password: string,
  confPassword: string
) {
  try {
    if (!password || !confPassword) {
      return new AppError(
        "Password and Confirm Password are required",
        StatusCodes.BAD_REQUEST
      );
    }

    if (password !== confPassword) {
      return new AppError(
        "Password and Confirm Password must be equal",
        StatusCodes.BAD_REQUEST
      );
    }

    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      forgotPasswordToken: hashToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return new AppError("User not registered", StatusCodes.NOT_FOUND);
    }

    user.password = password;

    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();
  } catch (err: any) {
    if (
      err.code === StatusCodes.BAD_REQUEST ||
      err.code === StatusCodes.NOT_FOUND
    ) {
      throw err;
    }
    throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function updateProfileService(
  id: string,
  body: any,
  imagePath: string
) {
  try {
    let cloudResp;
    if (imagePath.length > 0) {
      cloudResp = await uploadOnCloudinary(imagePath);
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          phone: body.phone,
          addresses: body.addresses,
          profilePhoto: cloudResp?.url || null,
        },
      },
      { new: true }
    )
      .select("-password")
      .select("-forgotPasswordToken")
      .select("-forgotPasswordExpiry")
      .select("-verificationDetails");

    return user;
  } catch (err: any) {
    if (err.code === StatusCodes.NOT_FOUND) {
      throw err;
    }
    throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
