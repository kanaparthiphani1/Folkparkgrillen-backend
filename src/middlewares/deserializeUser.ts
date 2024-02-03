import { NextFunction, Request, Response } from "express";
import { reIssueAccessToken, verifyJwt } from "../utils/jwt.utils";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  const refreshToken = req.cookies.refreshToken || req.headers["x-refresh"];

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    //reissue the access token
    console.log("ACCESS_TOKEN_EXPIRED");

    const newAccessToken = await reIssueAccessToken(refreshToken);
    if (!newAccessToken) return next();
    if (newAccessToken) {
      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        secure: false,
      });
    }

    const result = verifyJwt(newAccessToken);

    res.locals.user = result.decoded;
    return next();
  }

  return next();
};
