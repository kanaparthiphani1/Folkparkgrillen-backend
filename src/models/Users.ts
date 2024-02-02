import bcrypt from "bcrypt";
import mongoose from "mongoose";
import crypto from "crypto";
import { AddressDocument } from "./Addresses";
import { isHex } from "../utils/helpers";

export interface UserInput {
  email: string;
  name: string;
  phone: string;
  role: string;
  password: string;
  profilePhoto: string;
  addresses: [AddressDocument["id"]];
  verificationDetails: {
    verificationState: string;
    code: string;
    generatedAt: Date;
  };
  forgotPasswordToken: string | undefined;
  forgotPasswordExpiry: Date | undefined;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  genForgotPasswordToken(): String;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    verificationDetails: {
      verificationState: {
        type: String,
      },
      code: {
        type: String,
      },
      generatedAt: {
        type: Date,
      },
    },
    forgotPasswordToken: {
      type: String || undefined,
    },
    forgotPasswordExpiry: {
      type: Date || undefined,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, Number(process.env.SALT));
  }

  this.updatedAt = new Date();
});

UserSchema.methods.genForgotPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex").trim();

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
