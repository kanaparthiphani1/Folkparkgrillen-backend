import express from "express";
import { checkAdmin } from "../../middlewares/checkAdmin";
import {
  addDishType,
  addDishes,
  addTopping,
  removeDishes,
  updateDishes,
} from "../../controllers/admin.controller";
import { upload } from "../../middlewares/multer.middleware";
const router = express.Router();

router.post("/addTopping", checkAdmin, addTopping);
router.post("/addDishType", checkAdmin, addDishType);
router.post("/addDish", checkAdmin, upload.single("dish"), addDishes);
router.post("/removeDish", checkAdmin, removeDishes);
router.put("/update/dish/:id", checkAdmin, upload.single("dish"), updateDishes);

export default router;
