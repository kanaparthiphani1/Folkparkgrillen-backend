import express from "express";
import userRouter from "./user.router";
import adminRouter from "./admin.router";
import dishRouter from "./dish.router";

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/dish", dishRouter);

export default router;
