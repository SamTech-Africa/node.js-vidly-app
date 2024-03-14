const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

// Create Schema

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
    },
  })
);

// Get request for Genres List
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// Get request to get a genre by id
router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send(`Genre with id ${req.params.id} not found`);

  res.send(genre);
});

// Post request for genre
router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Post Genre
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

// Put request for genre to update genre
router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    return res.status(404).send(`Course with id: ${req.params.id} not found`);

  res.send(genre);
});

// Delete request to delete genre
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send(`Course with id: ${req.params.id} not found`);

  res.send(genre);
});

// ALL Functions
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
  });

  return schema.validate(genre);
}

module.exports = router;
