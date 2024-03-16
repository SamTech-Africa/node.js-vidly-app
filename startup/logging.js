require("winston-mongodb");
const winston = require("winston");
require("express-async-errors");

module.exports = function () {
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
      db: "mongodb://localhost/vidly",
      level: "info",
    })
  );

  const promise = Promise.reject(
    new Error("Couldn't connect to MongoDB while connecting")
  );
  promise.then(() => console.log("Done"));
};
