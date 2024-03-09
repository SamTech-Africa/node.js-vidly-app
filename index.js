const Joi = require("joi");
const express = require("express");

const app = express();

const vidlyUrl = "/vidly.com/api/genres";
const vidlyUrlWithId = "/vidly.com/api/genres/:id";

app.use(express.json());

const genres = [
  { id: 1, category: "Action" },
  { id: 2, category: "Drama" },
  { id: 3, category: "Comedy" },
];

// Get request for Genres List
app.get(vidlyUrl, (req, res) => {
  res.send(genres);
});

// Get request to get a genre by id
app.get(vidlyUrlWithId, (req, res) => {
  const genre = genres.find((gen) => gen.id === parseInt(req.params.id));

  if (!genre)
    return res.status(404).send(`Genre with id ${req.params.id} not found`);

  res.send(genre);
});

// Post request for genre
app.post(vidlyUrl, (req, res) => {
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
app.put(vidlyUrlWithId, (req, res) => {
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
app.delete(vidlyUrlWithId, (req, res) => {
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

// PORT or ROUTE
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
