const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = mongoose.Schema({
  comapanyName: {
    type: String,
    required: [true, "Comapany Name is Mandatory"],
    trim: true,
    minlength: [3, "Company Name should have minimum of 3 Characters"],
  },
  companyAddress: {
    type: String,
    required: [true, "Address is mandatory"],
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: [true, "Phone Number is mandatory"],
    validate: {
      validator: function (val) {
        return val.length === 10;
      },
      message: "Phone Number should have 10 digits",
    },
  },
  userName: {
    type: String,
    required: [true, "User Name is Mandatory"],
    minlength: [3, "Name should have minimum of 3 Characters"],
    maxlength: [15, "Name should be maximum of 15 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is Mandatory"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    select: false,
    required: [true, "Password is Mandatory"],
    trim: true,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is mandatory"],
    trim: true,
    select: false,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
    },
    message: "Password mismatch",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  passwordChangedAt: Date,
  resetToken: String,
  resetTokenExpiresAt: String,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});
userSchema.methods.compareBcryptPassword = async function (currentPassword) {
  return await bcrypt.compare(currentPassword, this.password);
};
userSchema.methods.passwordChangedCompareToken = function (tokenTimeStamp) {
  if (this.passwordChangedAt) {
    console.log(tokenTime, this.passwordChangedAt);
    const passwordtimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordtimeStamp > tokenTimeStamp;
  }
  return false;
};
userSchema.methods.resetTokenCreation = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetTokenExpiresAt = Date.now() + 10 * 60 * 60 * 1000;
  return resetToken;
};
const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
