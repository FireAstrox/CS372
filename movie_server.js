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

async function run() {

    try{
        const db = client.db('Movie_Site');
        const moviesCollection = db.collection('Movies');
        const usersCollection = db.collection('Users');

        // const movieTitle = '';
        // const movieGenre = '';
        // let movieViewCount = 0;
        // let movieLikeCount = 0;
        // const videoURL = '';

      //   const user = {
      //      username: 'Content-Manager',
      //      password: 'password'
      //   }

      //   const user2 = {
      //     username: 'viewer',
      //     password: 'password'
      //  }
    
        //const userResult = await usersCollection.insertOne(user);
        console.log(`User document inserted with _id: ${userResult.insertedId}`);
        
        // const movieResult = await moviesCollection.insertOne({
        //     title: movieTitle,
        //     genre: movieGenre,
        //     viewCount: movieViewCount,
        //     likeCount: movieLikeCount,
        //     videoUrl: videoURL,
        //});
        console.log('Movie document inserted with _id:', movieResult.insertedId);
    }
    catch (err) {
        console.error('An error occurred inserting the document: ', err);
    } 
    finally {
       await client.close();
    }
    }
run().catch(console.dir);

// Middleware
app.use(bodyParser.json());



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

app.get('*', (req, res) => {
  res.json("page not found");
});

// Routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userFound = await findUser(username);
  if (userFound) {
    switch(user.role) {
      case 'viewer':
        res.json({ redirect: '/viewer.html' });
        break;
      case 'Content-Manager':
        res.json({ redirect: '/content-manager.html' });
        break;
      case 'Marketing-Manager':
        res.json({ redirect: '/marketing-manager.html' });
        break;
      default:
        res.status(401).send('Unauthorized');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
  } catch (error) {
    console.error('Error logging in', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(8080, () => {
    console.log("Server is running on port", 8080);
});


/*********************************************************
----------------------------------------------------------
----------------Find User in Database---------------------
----------------------------------------------------------
*********************************************************/

async function findUser(username){
  try{

    const usersCollection = db.collection('Users');

    const user = await usersCollection.findOne({ username });

    return user;
  }
  catch (error) {
    console.error('Error finding user', error);
    throw error;
  }
}


/*********************************************************
----------------------------------------------------------
----------------Verify User Password----------------------
----------------------------------------------------------
*********************************************************/

async function verifyPassword()