const express = require("express");
const {
  signUp,
  signIn,
  protect,
} = require("../controllers/authControllers.js");
const router = express.Router();
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.use(protect);

module.exports = router;
