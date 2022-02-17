const express = require('express');
// const cors = require('cors');
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require('./controllers/articles-controllers');
const { postCommentByArticleId } = require('./controllers/comments-controllers');
const { getTopics } = require('./controllers/topics-controllers');
const { getUsers } = require('./controllers/users-controllers');
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
app.get('/api/users', getUsers);
app.get('/api/articles', getArticles);
app.get('/api/article/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchArticleById);
app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.all('/*', invalidPath);

app.use(psqlErrors);
app.use(customErrors);
app.use(serverError);

module.exports = app;
