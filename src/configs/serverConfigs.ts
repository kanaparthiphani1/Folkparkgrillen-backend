import dotenv from "dotenv";
dotenv.config();

export const configs = {
  port: process.env.PORT || 3000,
  privatekey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  publickey: process.env.PUBLIC_KEY?.replace(/\\n/g, "\n"),
};
