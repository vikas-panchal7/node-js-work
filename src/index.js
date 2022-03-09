const express = require("express");
const userRouter = require("./router/user");
const bikeTypeRouter = require("./router/biketype");
const bikeRouter = require("./router/bike");
require("./db/mongoose");

const port = 3000 || process.env.PORT;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(bikeTypeRouter);
app.use(bikeRouter);
app.listen(port, () => {
  console.log("Server is Up on " + port);
});
