const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRETE = process.env.JWT_SECRETE;

const userRouteCheck = (req, res) => {
  res.status(201).send({ msg: "User route is working" });
};

//register
const userRegister = async (req, res) => {
  try {
    const { companyName, userId, password } = req.body;

    if (!companyName || !userId || !password) {
      return res
        .status(500)
        .send({ success: false, msg: "Fill the All Required Fields" });
    }
    if (!validator.isEmail(userId)) {
      return res
        .status(500)
        .send({ success: false, msg: "Enter Valid UserID" });
    }
    if (!validator.isStrongPassword(password)) {
      return res
        .status(500)
        .send({ success: false, msg: "Please Enter Strong Password" });
    }

    const existUser = await User.findOne({ userId });
 
    if (existUser) {
      return res
        .status(500)
        .send({ success: false, msg: "User is Already Exist" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      companyName,
      userId,
      password: hashedPassword,
    };

    await User.create(newUser);
    return res
      .status(201)
      .send({ success: true, msg: "Admin Created Successfully" });
  } catch (error) {
    console.log(error.message);
    return res.send({ success: false, msg: error.message });
  }
};

// login
const userLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res
        .status(500)
        .send({ success: false, msg: "user ID or Password is Empty" });
    }

    const findUser = await User.findOne({ userId });
    const PScheck = bcrypt.compareSync(password, findUser?.password);

    if (!findUser || !PScheck) {
      return res
        .status(500)
        .send({ success: false, msg: "User ID or Password doesn't Match" });
    }

    const token = jwt.sign({ id: findUser._id }, JWT_SECRETE, {
      expiresIn: "1week",
    });
    return res.status(200).send({ success: true, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ success: false, msg: error.message });
  }
};

module.exports = { userRouteCheck, userRegister, userLogin };
