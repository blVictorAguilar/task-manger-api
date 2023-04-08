const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const PORT = process.env.PORT;

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log("server is up on ", PORT);
});
