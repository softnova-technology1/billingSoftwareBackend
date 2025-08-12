const express = require("express");
const {
  signUp,
  signIn,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  passMyId,
} = require("../controllers/authControllers.js");
const {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/userController.js");
const router = express.Router();
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/update-password", protect, updatePassword);
router.patch("/update-me", protect, updateMe);
router.get("/getme", protect, passMyId, getUserById);
router.use(protect, restrictTo("admin"));
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
