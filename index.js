require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const express = require("express");

const url = "mongodb://localhost/vidly";

const app = express();
require("./startup/routes")(app);

process.on("unhandledRejection", (exception) => {
  throw exception;
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

// Express error middleware functions

// PORT or ROUTE
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
