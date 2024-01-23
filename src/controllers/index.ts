import { Request, Response } from "express";
import { basicService } from "../services";

export function basicController(req: Request, res: Response) {
  const resString: string = basicService();
  res.json({ status: resString });
}
