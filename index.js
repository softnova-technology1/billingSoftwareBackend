const express = require("express");
const connectDB = require("./database/db");
const app = express();
require("dotenv").config();
const userRouter = require("./routes/userRoutes");

const port = process.env.PORT || 5000;

app.use(express.json());

//Database Connection
connectDB();

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Route is Working" });
});

// start command --> npm start
app.listen(port, () => {
  console.log(`Port Listening on http://localhost:${port}`);
});
