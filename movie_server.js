const express = require('express');
const app = express();
app.use(express.static('Movie Page'));
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));
const { MongoClient } = require('mongodb');

const path = require('path');

const mongoData = 'mongoData.json';

// MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017';

const client = new MongoClient(MONGODB_URI);
client.connect(async (err) => {
    if (err) {
        console.error("Failed to connect to the Database: ", err);
    } 
    else {
        const db = client.db('Movie Site');
        const moviesCollection = db.collection('Movies');
        const usersCollection = db.collection('Users');

        const movieTitle = '';
        const movieGenre = '';
        let movieViewCount = 0;
        let movieLikeCount = 0;


        const user = {
            username: 'Content Manager',
            password: 'password'
        };

    try {
        const userResult = await usersCollection.insertOne(user);
        console.log('User document inserted with _id:', userResult.insertedId);
    
        const movieResult = await moviesCollection.insertOne({
            title: movieTitle,
            genre: movieGenre,
            viewCount: movieViewCount,
            likeCount: movieLikeCount,
            user_id: userResult.insertedId
        });
        console.log('Movie document inserted with _id:', movieResult.insertedId);
    }
    catch (err) {
        console.error('An error occurred inserting the document: ', err);
    } 
    finally {
       await client.close();
    }
    }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('Movie Page'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/Movie Page/movie_login.html'));
});

app.get('/viewer', (req, res) => {
    res.sendFile(path.join(__dirname, "/Movie Page/viewer.html"));
});

app.get('/content-manager', (req, res) => {
    res.sendFile(path.join(__dirname, "/Movie Page/content-manager.html"));
});

app.get('/marketing-manager', (req, res) => {
    res.sendFile(path.join(__dirname, "/Movie Page/marketing-manager.html"));
});

// Routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findUserID({ username, password });
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