const mongoose = require("mongoose");

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
        console.log(val, val.length);
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
    required: [true, "Password is Mandatory"],
    trim: true,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is mandatory"],
    trim: true,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
    },
    message: "Password mismatch",
  },
  passwordChangedAt: Date,
  resetToken: String,
  resetTokenExpiresAt: String,
});
const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
