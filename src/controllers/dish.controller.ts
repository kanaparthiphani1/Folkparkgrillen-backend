import { Request, Response } from "express";
import { getAllDishesService } from "../services/dish.services";
import { StatusCodes } from "http-status-codes";

export async function getAllDishes(req: Request, res: Response) {
  try {
    const dishes = await getAllDishesService();
    return res.status(StatusCodes.OK).json({ dishes });
  } catch (err: any) {
    return res.status(err.statusCode).json(err);
  }
}
