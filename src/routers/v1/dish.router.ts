import express from "express";
import { checkAdmin } from "../../middlewares/checkAdmin";
import { getAllDishes } from "../../controllers/dish.controller";

const router = express.Router();

router.get("/", checkAdmin, getAllDishes);

export default router;
