import express from "express";
import { configs } from "./configs/serverConfigs";
import router from "./routers";
import { connect } from "./configs/dbConfig";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.listen(configs.port, async () => {
  console.log("Server Connected");
  await connect();
});
