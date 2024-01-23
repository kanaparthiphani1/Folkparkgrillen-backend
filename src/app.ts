import express from "express";
import { configs } from "./configs/serverConfigs";
import router from "./routers";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(configs.port, () => {
  console.log("Server Connected");
});
