import express from "express";
import v1Router from "./v1";
import { basicController } from "../controllers";

const router = express.Router();

router.get("/health-check", basicController);
router.use("/v1", v1Router);

export default router;
