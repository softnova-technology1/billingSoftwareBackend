const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/authControllers");
const {
  getAllCustomer,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
router.use(protect);
router.route("/").get(getAllCustomer).post(createCustomer);
router
  .route("/:id")
  .get(getCustomer)
  .patch(updateCustomer)
  .delete(deleteCustomer);
module.exports = router;
