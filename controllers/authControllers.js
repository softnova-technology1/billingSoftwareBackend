const AppError = require("../AppError");
const catchAsync = require("../catchAsync");
const userModel = require("../models/userSchema");
const UserModel = require("../models/userSchema");
const jwtToken = require("jsonwebtoken");
function jwtSignIn(id) {
  const token = jwtToken.sign({ id: id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
}
exports.signUp = catchAsync(async (req, res, next) => {
  const user = await UserModel.create(req.body);
  const token = jwtSignIn(user.id);
  user.password = undefined;
  res.status(201).json({
    status: "success",
    data: {
      user: user,
    },
    token,
  });
});
exports.signIn = catchAsync(async (req, res, next) => {
  const { userID, password } = req.body;
  if (!userID || !password) {
    return next(new AppError("UserId and password is Mandatory", 400));
  }
  const user = await userModel.findById(userID).select("+password");
  if (!user || !(await user.compareBcryptPassword(password))) {
    return next(new AppError("Invalid userID or password", 401));
  }
  const token = jwtSignIn(user.id);

  res.status(200).json({
    status: "success",
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  console.log(req.headers);
  next();
});
