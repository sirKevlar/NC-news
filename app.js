const express = require('express');
// const cors = require('cors');
const {
  getTopics,
  getArticleById,
} = require('./controllers/games-controllers');
const {
  invalidPath,
  serverError,
  psqlErrors,
  customErrors,
} = require('./errors/errors');

const app = express();

// app.use(cors())
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/article/:article_id', getArticleById);

app.all('/*', invalidPath);

app.use(psqlErrors);
app.use(customErrors);
app.use(serverError);

module.exports = app;
