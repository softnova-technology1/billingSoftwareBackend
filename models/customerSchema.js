const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Firstname is mandatory"],
    trim: true,
    minlength: [3, "Firstname should have atleast 3 characters "],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [25, "Lastname should be maximum of 10 characters"],
  },
  companyName: {
    type: String,
    trim: true,
    required: [true, "Company name is mandatory"],
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Phone Number is mandatory"],
    validate: {
      validator: function (value) {
        return value.length === 10;
      },
      message: "Please enter valid phone number",
    },
  },
  gstNumber: String,
  address: {
    type: String,
    required: [true, "Address is mandatory"],
  },
  city: {
    type: String,
    required: [true, "City is mandatory"],
  },
  state: {
    type: String,
    required: [true, "State is mandatory"],
  },
  pincode: {
    type: String,
    required: [true, "Pincode is mandatory"],
    validate: {
      validator: function (value) {
        return value.length === 6;
      },
      message: "Enter a valid pincode",
    },
  },
});
customerSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});
const customerModel = mongoose.model("customerModel", customerSchema);
module.exports = customerModel;
