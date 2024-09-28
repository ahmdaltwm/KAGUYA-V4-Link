import express from "express";
import config from "./KaguyaSetUp/config.js";
import { log } from "./logger/index.js";
var app = express();
const PORT = process.env.PORT ||  config.port || 8040;
app.get("/", (req, res) => {
  res.send("<h1>Kaguya Bot is running!</h1>");
});

app.listen(PORT, () => {
  log([
    {
      message: "[ EXPRESSJS ]: ",
      color: "green",
    },
    {
      message: `Listening on port : ${config.port} `,
      color: "white",
    },
  ]);
});
