import express from "express";
import {
  forgotPassword,
  resetPassword,
  signin,
  signout,
  signup,
  updateProfile,
  verifyOtpWithEmail,
} from "../../controllers/user.controller";
import { validateResource } from "../../middlewares/validateResource";
import { SignupEmailSchema } from "../../schemas/signup_email.schema";
import { SignInEmailSchema } from "../../schemas/signin_email.schema";
import checkUser from "../../middlewares/checkUser";
import { upload } from "../../middlewares/multer.middleware";

const router = express.Router();

router.post("/signup", validateResource(SignupEmailSchema), signup);
router.post("/verify", verifyOtpWithEmail);
router.post("/signin", validateResource(SignInEmailSchema), signin);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);
router.post("/update", checkUser, upload.single("profile"), updateProfile);
router.get("/signout", signout);
router.get("/dummy/restricted", checkUser, (req, res) => {
  return res.status(200).json({ message: "Success" });
});
router.get("/hello", (req, res) => {
  return res.json({ message: "Hello" });
});

export default router;
