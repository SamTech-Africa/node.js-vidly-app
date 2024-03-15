const { User, validate } = require("../models/user");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

// register
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // Vaidate if the user is not registered or not
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  await user.save();

  const response = _.pick(user, ["id", "name", "email"]);

  res.send(response);
});

module.exports = router;
