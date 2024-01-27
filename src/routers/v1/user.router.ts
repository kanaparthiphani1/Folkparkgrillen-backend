import express from "express";
import {
  signin,
  signout,
  signupwithemail,
  verifyOtpWithEmail,
} from "../../controllers/user.controller";
import { validateResource } from "../../middlewares/validateResource";
import { SignupEmailSchema } from "../../schemas/signup_email.schema";
import { SignInEmailSchema } from "../../schemas/signin_email.schema";
import { deserializeUser } from "../../middlewares/deserializeUser";
import checkUser from "../../middlewares/checkUser";

const router = express.Router();

router.post(
  "/signup/email",
  validateResource(SignupEmailSchema),
  signupwithemail
);

router.post("/verify/email", verifyOtpWithEmail);

router.post("/email/signin", validateResource(SignInEmailSchema), signin);
router.get("/signout", signout);
router.get("/dummy/restricted", checkUser, (req, res) => {
  return res.status(200).json({ message: "Success" });
});
router.get("/hello", (req, res) => {
  return res.json({ message: "Hello" });
});

export default router;
