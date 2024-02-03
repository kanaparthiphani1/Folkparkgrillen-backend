import mongoose from "mongoose";

const DishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dishType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DishType",
    },
    photo: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    rating: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    toppingsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topping",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Dish = mongoose.model("Dish", DishSchema);

export default Dish;
