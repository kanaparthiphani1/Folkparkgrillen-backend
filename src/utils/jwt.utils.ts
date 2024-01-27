import jwt from "jsonwebtoken";
import { configs } from "../configs/serverConfigs";
import AppError from "./app-error";
import { StatusCodes } from "http-status-codes";

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
