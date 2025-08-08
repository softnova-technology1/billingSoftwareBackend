const express = require("express");
const connectDB = require("./database/db");
const app = express();
require("dotenv").config();
const userRouter = require("./routes/userRoutes");
const AppError = require("./AppError");
const errorController = require("./controllers/errorController");

const port = process.env.PORT || 5000;

app.use(express.json());

//Database Connection
connectDB();

app.use("/users", userRouter);
app.use((req, res, next) => {
  next(new AppError(`Path Not Found ${req.originalUrl}`, 404));
});
app.use(errorController);
// start command --> npm start
const server = app.listen(port, () => {
  console.log(`Port Listening on http://localhost:${port}`);
});
process.on("uncaughtException", (err) => {
  console.log("uncaughtException");
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("unhandledrejection");
  server.close(() => {
    process.exit(1);
  });
});
