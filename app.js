const express = require('express');
// const cors = require('cors');
const { getTopics } = require('./controllers/games-controllers');
const { invalidPath, serverError } = require('./errors/errors');

const app = express();

// app.use(cors())
app.use(express.json());

app.get('/api/topics', getTopics);

app.all('/*', invalidPath);

app.use(serverError);

module.exports = app;
