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



function hashPassword(password, salt) {
  const hash = crypto.createHash('sha256');
  hash.update(password + salt);
  return hash.digest('hex');
}
function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}
async function verifyPassword(submittedPassword, storedHash, storedSalt) {
  const hashedSumbittedPassword = hashPassword(submittedPassword, storedSalt);
  return hashedSumbittedPassword === storedHash;
}


async function initializeDbConnection() {
    await client.connect();
    db = client.db('Movie_Site');
    console.log('Connected to MongoDB');
    const usersCollection = db.collection('Users');

    for (let user of presetUsers) {
      const salt = generateSalt();
      const hashedPassword = hashPassword(user.password, salt);

      await usersCollection.updateOne(
        { username: user.username },
        { $set: { hashedPassword, salt, role: user.role } },
        { upsert: true }
    );
    console.log(`User ${user.username} added/updated successfully`);
}
    // await client.close();
    // console.log('Disconnected from MongoDB');
}

initializeDbConnection().catch(console.error);





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
  const { username, submittedPassword } = req.body;

  try {
    const userFound = await findUser(username);
  if (userFound &&  await verifyPassword(submittedPassword, user.hashedPassword, user.salt)) {
    switch(userFound.role) {
      case 'Viewer':
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
