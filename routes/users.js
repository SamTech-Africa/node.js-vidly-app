const bcrypt = require("bcrypt");
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
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  const response = _.pick(user, ["id", "name", "email"]);

  res.header("x-auth-token", token).send(response);
});

module.exports = router;
