const express = require('express');
const app = express();
app.use(express.static('Movie Page'));
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));
const mongoose = require('mongoose');

const path = require('path');

const mongoData = 'mongoData.json';

// MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017';

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// User and Movie models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  role: String,
}));

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: String,
  genre: String,
  viewCount: Number,
  likeCount: Number,
}));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    switch(user.role) {
      case 'Viewer':
        res.json({ redirect: '/viewer.html' });
        break;
      case 'Content Manager':
        res.json({ redirect: '/content-manager.html' });
        break;
      case 'Marketing Manager':
        res.json({ redirect: '/marketing-manager.html' });
        break;
      default:
        res.status(401).send('Unauthorized');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.listen(8080, () => {
    console.log("Server is running on port", 8080);
});