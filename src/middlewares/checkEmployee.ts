import { Request, Response, NextFunction } from "express";
import User from "../models/Users";
import { StatusCodes } from "http-status-codes";

export const checkEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).json({ message: "Invalid Request" });
  }

  const userId = user.userId;

  const userObj = await User.findById(userId);
  if (!userObj) {
    return res.status(403).json({ message: "Invalid Request" });
  }

  if (!userObj.role.includes("EMPLOYEE")) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Not Authorized" });
  }

  return next();
};
