const express = require('express');
const app = express();
app.use(express.static('Movie_Page'));
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const path = require('path');
app.use(bodyParser.json());


const MONGODB_URI = 'mongodb://localhost:27017';

const client = new MongoClient(MONGODB_URI);


const presetUsers = [
  { username: 'Viewer', password: 'password', role: 'Viewer' },
  { username: 'Content-Manager', password: 'password', role: 'Content-Manager' },
  { username: 'Marketing-Manager', password: 'password', role: 'Marketing-Manager' }
];

/*********************************************************
----------------------------------------------------------
----------------Make MongoDB Connection-------------------
----------------------------------------------------------
*********************************************************/

const dbName = 'Movie_Site';
async function initializeDbConnection(collectionName) {
  console.log('Connected to MongoDB'); 
  try{
     await client.connect();

    return client.db(dbName).collection(collectionName)
  }
  catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    throw error;
  }
}

initializeDbConnection().catch(console.error);

/*********************************************************
----------------------------------------------------------
----------------Find User in Database---------------------
----------------------------------------------------------
*********************************************************/

async function findUser(username, collection){
  try{

    //const usersCollection = db.collection('Users');

    const user = await collection.findOne({ username: username });

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

async function verifyPassword(username, password, collection) {

  const userFound = await findUser(username, collection);
  
  if (userFound) {
    const hash = crypto.createHash('sha256').update(password).digest('hex');

    if (userFound.hashedPassword === hash){
      return true
    }
    else{
      return false;
    }

  }
  else {
    return false;
  }
}



/*********************************************************
----------------------------------------------------------
-------------------Main Login Page------------------------
----------------------------------------------------------
*********************************************************/

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Movie_Page/movie_login.html'));
});

/*********************************************************
----------------------------------------------------------
--------------------Login Function------------------------
----------------------------------------------------------
*********************************************************/
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const usersCollection = await initializeDbConnection('Users');
    const userFound = await findUser(username, usersCollection);
  if (userFound) {//&&  await verifyPassword(submittedPassword, user.hashedPassword, user.salt)) {
    console.log("user found");
    const passwordCorrect = await verifyPassword(username, password, usersCollection);
    if(passwordCorrect) {
      res.json({ success: true, role: userFound.role, message: 'Login Successful'});
      console.log ("login success");
    }
    else {
      res.json({ success: false, message: 'Incorrect Password'});
      console.log ('something wrong bad password')
    }
 
  }
  else {
    console.log("User not found");
    res.json({ success: false, message: 'User not found'});
}
} catch (error) {
    console.error('Error logging in', error);
    res.status(500).send('Internal Server Error');
  }
  
});

/*********************************************************
----------------------------------------------------------
-----------------Viewer Mainpage Route--------------------
----------------------------------------------------------
*********************************************************/

app.get('/viewer', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(path.join(__dirname, "/Movie_Page/viewer.html"));
});

/*********************************************************
----------------------------------------------------------
-----------Content-Manager Mainpage Route-----------------
----------------------------------------------------------
*********************************************************/

app.get('/content-manager', (req, res) => {
    res.sendFile(path.join(__dirname, "/Movie_Page/content-manager.html"));
});

/*********************************************************
----------------------------------------------------------
-----------Content-Manager Add Movie Route----------------
----------------------------------------------------------
*********************************************************/

app.get('/content-add', async (req, res) => {
      res.sendFile(path.join(__dirname, "/Movie_Page/content-add.html"));
});

/*********************************************************
----------------------------------------------------------
-----------Marketing-Manager Mainpage Route---------------
----------------------------------------------------------
*********************************************************/

app.get('/marketing-manager', (req, res) => {
    res.sendFile(path.join(__dirname, "/Movie_Page/marketing-manager.html"));
});

/*********************************************************
----------------------------------------------------------
-----------Add Movie into Database function---------------
----------------------------------------------------------
*********************************************************/

app.post('/addMovie', async (req, res) =>{
  const { title, genre, videoUrl } = req.body;
  let { likes } = req.body;

  // Convert likes to an integer
  likes = parseInt(likes, 10);
  if (isNaN(likes)) { likes = 0; } // Default to 0 if conversion fails
  
    try {
      const moviesCollection = await initializeDbConnection('Movies');
      const result = await moviesCollection.insertOne({ title, genre, videoUrl, likes });
      if (result.acknowledged) {
        console.log('Movie added successfully'); 
        res.json({ success: true, message: 'Movie added successfully'});
      }
      else {
        throw new Error('Movie insertion failed');
      }
    }
    catch (error) {
      console.error('Failed to add movie:, error ')
      res.status(500).json({ success: false, message: 'Failed to add movie' });
    }
});

/*********************************************************
----------------------------------------------------------
------------Get all current Movies function---------------
----------------------------------------------------------
*********************************************************/

app.get('/movies', async (req, res) => {
  try {
      const moviesCollection = await initializeDbConnection("Movies");
      const movies = await moviesCollection.find().toArray();
      res.json(movies); 
  } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/*********************************************************
----------------------------------------------------------
-----------Delete a movie from the database---------------
----------------------------------------------------------
*********************************************************/

app.delete('/deleteMovie/:movieId', async (req, res) => {
  const { movieId } = req.params;
  if (!movieId || !ObjectId.isValid(movieId)) {
    return res.status(400).json({ success: false, message: 'Invalid movie ID format' });
}
  try {
      const moviesCollection = await initializeDbConnection('Movies');
      const result = await moviesCollection.deleteOne({ _id: new ObjectId(movieId) });
      if (result.deletedCount === 1) {
          console.log('Movie deleted successfully');
          res.json({ success: true, message: 'Movie deleted successfully' });
      } else {
          throw new Error('Movie deletion failed');
      }
  } catch (error) {
      console.error('Failed to delete movie:', error);
      res.status(500).json({ success: false, message: 'Failed to delete movie' });
  }
});

/*********************************************************
----------------------------------------------------------
--------Add a comment for a movie into database-----------
----------------------------------------------------------
*********************************************************/

app.post('/addComment/:movieId', async (req, res) => {
  const { movieId } = req.params;
  const { username, comment } = req.body;

  if (!ObjectId.isValid(movieId)) {
    return res.status(400).send('Invalid movie ID.');
  }

  try {
    const moviesCollection = await initializeDbConnection('Movies');
    const result = await moviesCollection.updateOne(
      { _id: new ObjectId(movieId) },
      { $push: { comments: { username, comment, timestamp: new Date().toISOString() } } }
    );

    if (result.matchedCount === 1) {
      res.json({ success: true, message: 'Comment added successfully.' });
      console.log('Comment added Successfully');
    } else {
      res.status(404).send('Movie not found.');
    }
  } catch (error) {
    console.error('Failed to add comment:', error);
    res.status(500).send('Failed to add comment.');
  }
});

/*********************************************************
----------------------------------------------------------
---Change the Like counter for a movie in the Database----
----------------------------------------------------------
*********************************************************/

app.post('/likeMovie/:movieId', async (req, res) => {
  toggleLike(req, res, 1); // Increment likes
});

app.delete('/likeMovie/:movieId', async (req, res) => {
  toggleLike(req, res, -1); // Decrement likes
});

async function toggleLike(req, res, increment) {
  const { movieId } = req.params;
  if (!ObjectId.isValid(movieId)) {
      return res.status(400).send('Invalid movie ID.');
  }
  
  try {
      const moviesCollection = await initializeDbConnection('Movies');
      const result = await moviesCollection.updateOne(
          { _id: new ObjectId(movieId) },
          { $inc: { likes: increment } }
      );
      
      if (result.modifiedCount === 1) {
          res.json({ success: true, message: 'Like updated successfully.' });
          console.log (`Successfully updated likes for ${movieId}`)
      } else {
          res.status(404).send('Movie not found.');
      }
  } catch (error) {
      console.error('Failed to update like:', error);
      res.status(500).send('Failed to update like.');
  }
}

/*********************************************************
----------------------------------------------------------
----------------------Info block--------------------------
----------------------------------------------------------
*********************************************************/
app.get('*', (req, res) => {
  res.json("page not found");
});

app.listen(8080, () => {
    console.log("Server is running on port", 8080);
});
