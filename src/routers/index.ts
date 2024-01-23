import express from "express";
import { basicController } from "../controllers";

const router = express.Router();

router.get("/health-check", basicController);

export default router;
