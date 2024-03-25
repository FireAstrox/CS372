const express = require('express');
const app = express();
app.use(express.static('Movie Page'));
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const path = require('path');
app.use(bodyParser.json());

const mongoData = 'mongoData.json';

// MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017';

const client = new MongoClient(MONGODB_URI);


const presetUsers = [
  { username: 'Viewer', password: 'password', role: 'Viewer' },
  { username: 'Content-Manager', password: 'password', role: 'Content Manager' },
  { username: 'Marketing-Manager', password: 'password', role: 'Marketing Manager' }
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

    if (userFound.password === hash){
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
    res.sendFile(path.join(__dirname, '/Movie Page/movie_login.html'));
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

app.get('/addMovies', async (req, res) => {
  // try {
  //     const moviesCollection = await connectToMongoDB("Movies");
  //     const movies = await moviesCollection.find().toArray();
      res.sendFile(path.join(__dirname, "/Movie Page/content-add.html"));
      //res.json(movies);
  // } catch (error) {
  //     console.error('Error fetching movies:', error);
  //     res.status(500).json({ success: false, message: 'Internal server error' });
  // }
});
app.get('*', (req, res) => {
  res.json("page not found");
});

// Routes
app.post('/login', async (req, res) => {
  const { username, submittedPassword } = req.body;

  try {
    const usersCollection = await initializeDbConnection('Users');
    const userFound = await findUser(username, usersCollection);
  if (userFound) {//&&  await verifyPassword(submittedPassword, user.hashedPassword, user.salt)) {
    console.log("user found");
    const passwordCorrect = await verifyPassword(username, password, usersCollection);
    if(passwordCorrect) {
      res.json({ success: true, message: 'Login Successful'});
      console.log ("login success");
    }
    else {
      res.json({ success: false, message: 'Incorrect Password'});
      console.log ('something wrong')
    }
  
  // switch(userFound.role) {
  //     case 'Viewer':
  //       res.json({ success: true, message: "login success" });
  //       break;
  //     case 'Content-Manager':
  //       res.json({ redirect: '/content-manager.html' });
  //       break;
  //     case 'Marketing-Manager':
  //       res.json({ redirect: '/marketing-manager.html' });
  //       break;
  //     default:
  //       res.status(401).send('Unauthorized');
  //   }
  // } else {
  //   res.status(401).send('Unauthorized');
  // }
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