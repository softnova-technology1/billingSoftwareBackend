const AppError = require("../AppError");
const catchAsync = require("../catchAsync");
const UserModel = require("../models/userSchema");
exports.signUp = catchAsync(async (req, res, next) => {
  const users = await UserModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: users,
  });
});
