import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(<string>process.env.DB_URI);
  } catch (e) {
    console.log(e);
  }
}
