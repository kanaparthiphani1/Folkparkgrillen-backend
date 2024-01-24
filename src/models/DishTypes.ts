import mongoose from "mongoose";

const DishTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DishType = mongoose.model("DishType", DishTypeSchema);

export default DishType;
