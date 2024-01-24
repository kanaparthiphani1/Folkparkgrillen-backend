import mongoose from "mongoose";

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

const Address = mongoose.model("Address", AddressSchema);

export default Address;
