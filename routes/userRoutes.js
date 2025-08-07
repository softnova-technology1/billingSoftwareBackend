const {
  userRouteCheck,
  userRegister,
  userLogin,
} = require("../controllers/userControllers");

const router = require("express").Router();

router.get("/", userRouteCheck);
router.post("/register", userRegister);
router.post("/login", userLogin);

module.exports = router;
