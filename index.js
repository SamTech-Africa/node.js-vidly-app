require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const users = require("./routes/users");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const express = require("express");
const auth = require("./routes/auth");

const url = "mongodb://localhost/vidly";

const app = express();

process.on("uncaughtException", (exception) => {
  winston.error(exception.message, exception);
  process.exit(1);
});

process.on("unhandledRejection", (exception) => {
  winston.error(exception.message, exception);
  process.exit(1);
});

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

winston.add(
  new winston.transports.File({
    filename: "logfile.log",
    handleExceptions: true,
  })
);

winston.add(
  new winston.transports.MongoDB({
    db: url,
    level: "info",
  })
);

const promise = Promise.reject(
  new Error("Couldn't connect to MongoDB while connecting")
);
promise.then(() => console.log("Done"));

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey IS NOT defined");
  process.exit(1);
}

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);
// Express error middleware functions

// PORT or ROUTE
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
