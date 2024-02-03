import { StatusCodes } from "http-status-codes";
import DishType from "../models/DishTypes";
import Dish from "../models/Dishes";
import Topping from "../models/Toppings";
import AppError from "../utils/app-error";
import { destroyOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

export async function addDishService(
  name: string,
  description: string,
  price: number,
  dishTypeId: string,
  toppings: [string],
  category: string,
  dishFilePath: string
) {
  try {
    const dishType = await DishType.findById(dishTypeId);
    const promises = await toppings.map(
      async (topping) => await Topping.findById(topping)
    );
    const toppingList = await Promise.all(promises);
    const cloudinaryRes = await uploadOnCloudinary(dishFilePath, "dish", name);
    console.log("Cloudinary Resp : ", cloudinaryRes);

    const dish = new Dish({
      name,
      description,
      price,
      dishType: dishType,
      category: category,
      toppingsList: toppingList,
      photo: {
        url: cloudinaryRes?.url || "",
        public_id: cloudinaryRes?.public_id || "",
      },
    });
    return dish.save();
  } catch (err: any) {
    throw new AppError("Error saving dish", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function addToppingService(name: string, price: number) {
  try {
    const topping = new Topping({
      name,
      price,
      status: "AVAILABLE",
    });
    return topping.save();
  } catch (err: any) {
    throw new AppError(
      "Error Adding Topping",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

export async function addDishTypeService(name: string) {
  try {
    const dishType = new DishType({
      name,
    });
    return dishType.save();
  } catch (err: any) {
    throw new AppError(
      "Error Adding DishType",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

export async function removeDishesService(dishId: [string]) {
  try {
    const dishPromise = dishId.map(async (id) => await Dish.findById(id));
    const dishes = await Promise.all(dishPromise);
    await dishes.forEach(
      async (dish) => await destroyOnCloudinary(dish?.photo?.public_id)
    );
    return await Dish.deleteMany({ _id: { $in: dishId } });
  } catch (err: any) {
    return new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

//TODO: validate updateObj
export async function updateDishService(
  dishId: string,
  updateObj: any,
  dishFilePath: string
) {
  try {
    let photoUrl = undefined;
    if (dishFilePath.length > 0) {
      const dish = await Dish.findById(dishId);
      await destroyOnCloudinary(dish?.photo?.public_id);
      photoUrl = await uploadOnCloudinary(dishFilePath, "dish", dish?.name);
    }

    return await Dish.findByIdAndUpdate(
      dishId,
      {
        ...updateObj,
        photo: {
          url: photoUrl?.url || "",
          public_id: photoUrl?.public_id || "",
        },
      },
      { new: true }
    );
  } catch (err: any) {
    return new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
