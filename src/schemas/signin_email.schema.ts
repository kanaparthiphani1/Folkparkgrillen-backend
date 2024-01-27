import { TypeOf, object, string } from "zod";

export const SignInEmailSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Enter proper email address"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password must be at least 6 characters"),
  }),
});

export type SignInInput = TypeOf<typeof SignInEmailSchema>;
