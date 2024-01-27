import express from "express";
import { configs } from "./configs/serverConfigs";
import router from "./routers";
import { connect } from "./configs/dbConfig";
import cookieParser from "cookie-parser";
import { deserializeUser } from "./middlewares/deserializeUser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(deserializeUser);
app.use("/api", router);

app.listen(configs.port, async () => {
  console.log(`Server Connected at ${configs.port}`);
  await connect();
});
