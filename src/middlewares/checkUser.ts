import { Request, Response, NextFunction } from "express";

const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).json({ message: "Invalid Request" });
  }

  return next();
};

export default checkUser;
