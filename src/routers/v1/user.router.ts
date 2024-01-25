import express from "express";
import {
  signupwithemail,
  verifyOtpWithEmail,
} from "../../controllers/user.controller";
import { validateResource } from "../../middlewares/validateResource";
import { SignupEmailSchema } from "../../schemas/signup_email.schema";

const router = express.Router();

router.post(
  "/signup/email",
  validateResource(SignupEmailSchema),
  signupwithemail
);

router.post("/verify/email", verifyOtpWithEmail);

router.get("/hello", (req, res) => {
  return res.json({ message: "Hello" });
});

export default router;
