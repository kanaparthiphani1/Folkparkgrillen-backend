import { StatusCodes } from "http-status-codes";
import Dish from "../models/Dishes";
import AppError from "../utils/app-error";

export async function getAllDishesService() {
  try {
    const dishes = await Dish.find()
      .select("-createdAt")
      .select("updatedAt")
      .populate("dishType")
      .populate("toppingsList");
    return dishes;
  } catch (err: any) {
    throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
