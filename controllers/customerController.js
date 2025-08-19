const catchAsync = require("../catchAsync");
const customerModel = require("../models/customerSchema");
exports.getAllCustomer = catchAsync(async (req, res, next) => {
  const customer = await customerModel.find();
  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
});
exports.createCustomer = catchAsync(async (req, res, next) => {
  const customer = await customerModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      customer,
    },
  });
});
exports.getCustomer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const customer = await customerModel.findById(id);
  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
});
exports.updateCustomer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const customer = await customerModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
});
exports.deleteCustomer = catchAsync(async (req, res, next) => {
  await customerModel.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
