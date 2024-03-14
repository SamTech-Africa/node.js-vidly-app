const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

// Create Schema
const genreShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
});

const 

const genres = [
  { id: 1, category: "Action" },
  { id: 2, category: "Drama" },
  { id: 3, category: "Comedy" },
];

// Get request for Genres List
router.get("/", (req, res) => {
  res.send(genres);
});

// Get request to get a genre by id
router.get("/:id", (req, res) => {
  const genre = genres.find((gen) => gen.id === parseInt(req.params.id));

  if (!genre)
    return res.status(404).send(`Genre with id ${req.params.id} not found`);

  res.send(genre);
});

// Post request for genre
router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Post Genre
  const genre = {
    id: genres.length + 1,
    category: req.body.category,
  };
  genres.push(genre);

  res.send(genre);
});

// Put request for genre to update genre
router.put("/:id", (req, res) => {
  const genre = genres.find((gen) => gen.id === parseInt(req.params.id));

  if (!genre)
    return res.status(404).send(`Course with id: ${req.params.id} not found`);

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // update genre
  genre.category = req.body.category;
  res.send(genre);
});

// Delete request to delete genre
router.delete("/:id", (req, res) => {
  const genre = genres.find((gen) => gen.id === parseInt(req.params.id));

  if (!genre)
    return res.status(404).send(`Course with id: ${req.params.id} not found`);

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

// ALL Functions
function validateGenre(genre) {
  const schema = Joi.object({
    category: Joi.string().min(1).required(),
  });

  return schema.validate(genre);
}

module.exports = router;
