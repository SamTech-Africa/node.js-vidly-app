const mongoose = require("mongoose");
const customers = require("./routes/customers");
const genres = require("./routes/genres");
const express = require("express");

const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);

// PORT or ROUTE
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
