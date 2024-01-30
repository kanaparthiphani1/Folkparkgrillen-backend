import jwt from "jsonwebtoken";
import { configs } from "../configs/serverConfigs";
import AppError from "./app-error";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import User from "../models/Users";

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  try {
    return jwt.sign(object, <string>configs.privatekey, {
      ...options,
      algorithm: "RS256",
    });
  } catch (err: any) {
    throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, <string>configs.publickey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}

export async function reIssueAccessToken(refreshToken: string) {
  const { decoded, expired } = verifyJwt(refreshToken);
  if (expired) {
  }
  if (!decoded || !get(decoded, "userId")) return false;

  const user = await User.findById(get(decoded, "userId"));

  if (!user) return false;

  const accessToken = signJwt(
    { userId: user._id },
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
  );

  return accessToken;
}
