const jwt = require("jsonwebtoken");
const config = require("config");

// Shortcut to export function just add it before the function
module.exports = function (req, res, next) {
  // Authorize
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (exception) {
    res.status(400).send("Invalid token");
  }
};
