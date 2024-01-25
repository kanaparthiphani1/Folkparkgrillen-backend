import mongoose from "mongoose";

export interface AddressDocument extends mongoose.Document {
  address_1: string;
  address_2: string;
  zipcode: number;
  city: string;
  state: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new mongoose.Schema(
  {
    address_1: {
      type: String,
      required: true,
    },
    address_2: {
      type: String,
      required: true,
    },
    zipcode: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model<AddressDocument>("Address", AddressSchema);

export default Address;
