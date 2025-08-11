const catchAsync = require("../catchAsync");

exports.getAllUser = catchAsync((req, res, next) => {
  res.status(200).json({
    status: "success",
  });
});
