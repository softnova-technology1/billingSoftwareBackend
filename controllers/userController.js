const catchAsync = require("../catchAsync");
const userModel = require("../models/userSchema");
exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({
    status: "success",
    data: {
      user: users,
    },
  });
});
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await userModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: user,
    },
  });
});
exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    message: null,
  });
});
