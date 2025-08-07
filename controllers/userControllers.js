const userRouteCheck = (req, res) => {
  res.status(201).send({ msg: "User route is working" });
};

module.exports = userRouteCheck;
