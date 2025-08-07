const userRouteCheck = require("../controllers/userControllers");

const router = require("express").Router();

router.get("/", userRouteCheck);

module.exports = router;
