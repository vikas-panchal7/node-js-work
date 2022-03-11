const express = require("express");
require("./db/mongoose");

const userRouter = require("./router/user");
const bikeTypeRouter = require("./router/biketype");
const bikeRouter = require("./router/bike");
const commentRouter = require("./router/comment");
const likeRouter = require("./router/like");

const port = 3000 || process.env.PORT;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(bikeTypeRouter);
app.use(bikeRouter);
app.use(commentRouter);
app.use(likeRouter);

app.listen(port, () => {
  console.log("Server is Up on " + port);
});
