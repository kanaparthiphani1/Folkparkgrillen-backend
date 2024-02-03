import { Request, Response } from "express";
import {
  addDishService,
  addDishTypeService,
  addToppingService,
  removeDishesService,
  updateDishService,
} from "../services/admin.service";

export async function addDishes(req: Request, res: Response) {
  try {
    const { name, description, price, dishTypeId, category, toppings } =
      req.body;
    const dishFilePath = req.file?.path || "";
    const resp = await addDishService(
      name,
      description,
      price,
      dishTypeId || "OTH_DIS",
      toppings,
      category,
      dishFilePath
    );
    return res.status(200).json({ message: "Dish added successfully" });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
}

export async function removeDishes(req: Request, res: Response) {
  try {
    const dishIds = req.body;
    const resp = await removeDishesService(dishIds);
    return res.status(200).json({ message: "Dishes removed successfully" });
  } catch (err: any) {
    return res.status(err.status).json({ message: err.message });
  }
}

export async function updateDishes(req: Request, res: Response) {
  try {
    const dishId = req.params.id;

    const dishFilePath = req.file?.path || "";
    const resp = await updateDishService(dishId, req.body, dishFilePath);
    return res.status(200).json({ message: "Dish updated successfully" });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
}

export async function addEmployee(req: Request, res: Response) {
  try {
  } catch (err: any) {}
}

export async function removeEmployee(req: Request, res: Response) {}

export async function updateEmployee(req: Request, res: Response) {}

export async function addDishType(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const resp = await addDishTypeService(name);
    return res.status(200).json(resp);
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

export async function removeDishType(req: Request, res: Response) {}

export async function addTopping(req: Request, res: Response) {
  try {
    const { name, price } = req.body;
    const resp = await addToppingService(name, price);
    return res.status(200).json({
      message: "success",
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

export async function removeTopping(req: Request, res: Response) {}

export async function updateTopping(req: Request, res: Response) {}
