import { TypeOf, object, string } from "zod";

export const SignupEmailSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Enter proper email address"),
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

export type SignupEmailInput = Omit<
  TypeOf<typeof SignupEmailSchema>,
  "body.confirmPassword"
>;
