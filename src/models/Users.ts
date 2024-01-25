import mongoose from "mongoose";
import { AddressDocument } from "./Addresses";

export interface UserInput {
  email: string;
  name: string;
  phone: string;
  role: string;
  password: string;
  profilePhoto: { id: string; secure_url: string };
  addresses: [AddressDocument["id"]];
  verificationDetails: {
    verificationState: string;
    code: string;
    generatedAt: Date;
  };
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
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
      id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
