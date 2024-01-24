import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    toppings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topping",
        required: true,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

export default OrderItem;
