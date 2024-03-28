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


// MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017';

const client = new MongoClient(MONGODB_URI);


const presetUsers = [
  { username: 'Viewer', password: 'password', role: 'Viewer' },
  { username: 'Content-Manager', password: 'password', role: 'Content-Manager' },
  { username: 'Marketing-Manager', password: 'password', role: 'Marketing-Manager' }
];


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

//helper functions to fix the password hashes

// function correctHashPassword(password) {
//   if (!hashedPassword) {
//     throw new Error('Password is undefined, cannot hash.');
// }
// const hash = crypto.createHash('sha256');
// hash.update(hashedPassword);
// return hash.digest('hex');
// }

// async function updatePasswordHashes() {
//   await client.connect();
//   const db = client.db('Movie_Site');
//   const usersCollection = db.collection('Users');

//   const users = await usersCollection.find().toArray(); // Gets all users

//   for (const user of users) {
//     if (typeof user.password === 'undefined') {
//       console.error(`User ${user.username} has no password defined.`);
//       continue; // Skip this user and move to the next
//   }  
    
//     const correctHash = correctHashPassword(user.password); // Assume 'user.password' is the original plain text password

//       await usersCollection.updateOne(
//           { _id: user._id }, // Use the unique identifier for the user document
//           { $set: { password: correctHash } } // Update the password field with the correct hash
//       );
//   }

//   console.log('All passwords updated.');
//   client.close();
// }

// updatePasswordHashes().catch(console.error);

/*********************************************************
----------------------------------------------------------
----------------Make MongoDB Connection-------------------
----------------------------------------------------------
*********************************************************/
const dbName = 'Movie_Site';
async function initializeDbConnection(collectionName) {
   try{
     await client.connect();
    console.log('Connected to MongoDB');
//     db = client.db('Movie_Site'); // Connecting to the database

//     for (let user of presetUsers) {
//       const salt = generateSalt();
//       const hashedPassword = hashPassword(user.password, salt);

//       const usersCollection = db.collection('Users');
//       await usersCollection.updateOne(
//         { username: user.username },
//         { $set: { hashedPassword, salt, role: user.role } },
//         { upsert: true }
//     );
//     console.log(`User ${user.username} added/updated successfully`);
// }
    // await client.close();
    // console.log('Disconnected from MongoDB');
    return client.db(dbName).collection(collectionName)
  }
  catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    throw error;
  }
}

initializeDbConnection().catch(console.error);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Movie_Page/movie_login.html'));
});

app.get('/viewer', (req, res) => {
    res.sendFile(path.join(__dirname, "/Movie_Page/viewer.html"));
});

app.get('/content-manager', (req, res) => {
    res.sendFile(path.join(__dirname, "/Movie_Page/content-manager.html"));
});

app.get('/marketing-manager', (req, res) => {
    res.sendFile(path.join(__dirname, "/Movie_Page/marketing-manager.html"));
});

app.get('/addMovies', async (req, res) => {
  // try {
  //     const moviesCollection = await connectToMongoDB("Movies");
  //     const movies = await moviesCollection.find().toArray();
      res.sendFile(path.join(__dirname, "/Movie_Page/content-add.html"));
      //res.json(movies);
  // } catch (error) {
  //     console.error('Error fetching movies:', error);
  //     res.status(500).json({ success: false, message: 'Internal server error' });
  // }
});

app.post('/addMovie', async (req, res) =>{
  const { title, genre, videoUrl, likes } = req.body;
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


app.get('/movies', async (req, res) => {
  try {
      const moviesCollection = await initializeDbConnection("Movies");
      const movies = await moviesCollection.find().toArray();
      res.json(movies); // Assuming you are using a template engine like EJS
  } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.get('*', (req, res) => {
  res.json("page not found");
});

// Routes
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

app.listen(8080, () => {
    console.log("Server is running on port", 8080);
});


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
    } else {
      res.status(404).send('Movie not found.');
    }
  } catch (error) {
    console.error('Failed to add comment:', error);
    res.status(500).send('Failed to add comment.');
  }
});