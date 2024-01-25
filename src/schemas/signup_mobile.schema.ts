import validator from "validator";
import { TypeOf, number, object, string } from "zod";

export const SignupMobileSchema = object({
  body: object({
    mobile: string({
      required_error: "Mobile number required",
    }).refine((data) => validator.isMobilePhone(data, "en-IN"), {
      message: "Mobile number is not a valid number",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password must be at least 6 characters"),
    confirmPassword: string({
      required_error: "Confirm password is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export type SignupMobileInput = Omit<
  TypeOf<typeof SignupMobileSchema>,
  "body.confirmPassword"
>;
