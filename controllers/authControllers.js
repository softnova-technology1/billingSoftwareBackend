const AppError = require("../AppError");
const catchAsync = require("../catchAsync");
const userModel = require("../models/userSchema");
const UserModel = require("../models/userSchema");
const jwtToken = require("jsonwebtoken");
const sendEmail = require("../email");
const crypto = require("crypto");
const { promisify } = require("util");
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
  let bearertoken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    bearertoken = req.headers.authorization.split(" ")[1];
  }
  if (!bearertoken) {
    return next(new AppError("Please try to sign in ", 401));
  }
  const decoded = await promisify(jwtToken.verify)(
    bearertoken,
    process.env.JWT_SECRETE
  );

  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("The user belonging to the token has no longer exist ", 401)
    );
  }
  if (user.passwordChangedCompareToken(decoded.iat)) {
    return next(new AppError("Please try to sign in with new password", 401));
  }
  req.user = user;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const allowedUser = roles.includes(req.user.role);
    if (!allowedUser) {
      return next(
        new AppError("You Don't have the permission to do this operation", 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("No user available with this emailId", 404));
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("No user available with this emailId", 404));
  }
  const resetToken = user.resetTokenCreation();
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/users/reset-password/${resetToken}`;
  await user.save({ validateBeforeSave: false });
  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password and token expire within 10minutes",
      text: resetUrl,
    });
    res.status(200).json({
      status: "success",
      message: "token sent successfully",
    });
  } catch (error) {
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("Issues in sending a mail.Please try again later", 500)
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const encryptToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await userModel.findOne({
    resetToken: encryptToken,
    resetTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Inavalid token or token expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  const token = jwtSignIn(user.id);
  res.status(201).json({
    status: "success",
    token,
  });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword, existingPassword } = req.body;
  const user = await userModel.findById(req.user.id).select("+password");
  if (!user || !(await user.compareBcryptPassword(existingPassword))) {
    return next(new AppError("wrongly entered current password", 401));
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();
  const token = jwtSignIn(user.id);
  res.status(201).json({
    status: "success",
    token,
  });
});
function filterObj(updateData, ...filedstoUpdate) {
  let newObj = {};
  Object.keys(updateData).forEach((key) => {
    if (filedstoUpdate.includes(key)) {
      newObj[key] = updateData[key];
    }
  });
  return newObj;
}
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError("Unable to update password by this route", 400));
  }
  const objData = filterObj(
    req.body,
    "email",
    "comapanyName",
    "companyAddress",
    "phoneNumber",
    "userName"
  );

  const user = await userModel.findByIdAndUpdate(req.user.id, objData, {
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
exports.passMyId = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
