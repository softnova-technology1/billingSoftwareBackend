const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is Required"],
    },
    userId: {
      type: String,
      required: [true, "User ID is Required"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("user", userSchema);
module.exports = User;
