const express = require('express');
// const cors = require('cors');
const { getTopics } = require('./controllers/games-controllers');

const app = express();

// app.use(cors())
app.use(express.json());

app.get('/api/topics', getTopics);

module.exports = app;
