// Importing required modules
const express = require('express');
const fs = require('fs').promises;
const app = express();
app.use(express.static('public'));
app.use(express.json());
const router = express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));
const path = require('path');

// File path for users data
const usersFile = 'users.json';

/*********************************************************
----------------------------------------------------------
----------------Find User in JSON File--------------------
----------------------------------------------------------
*********************************************************/
async function findUserID(username, filePath) {
    try {
        // Read the JSON file
        const data = await fs.readFile(filePath, 'utf8');
        // Parse the JSON data
        const jSONuserData = JSON.parse(data);
        // Find the user with the given username
        const user = jSONuserData.users.find(user => user.username === username);
        // Return true if user exists, false otherwise
        return !!user;
    } 
    catch (error) {
        console.error('Error reading the JSON file:', error);
        return false;
    }
}

/*********************************************************
----------------------------------------------------------
--------------------Create New User-----------------------
----------------------------------------------------------
*********************************************************/

async function createUser(username, password, filePath) {
    try {
        // Read the JSON file
        let data = await fs.readFile(filePath, 'utf8');
        // Parse the JSON data
        let jSONuserData = JSON.parse(data);
        // Check if the username already exists
        const userExists = jSONuserData.users.some(user => user.username === username);

        if (userExists) {
            console.log(`User '${username}' already exists.`);
            return false;
        }

        // Create a new user object
        const newUser = {
            username: username,
            password: password,
            failedAttempts: 0
        };

        // Add the new user to the JSON file
        jSONuserData.users.push(newUser);

        // Write the updated JSON data to the file
        await fs.writeFile(filePath, JSON.stringify(jSONuserData, null, 4), 'utf8');
        console.log(`User '${username}' created successfully.`);
        return true;
    } catch (error) {
        console.error('Error reading/writing JSON file:', error);
        return false;
    }
}

/*********************************************************
----------------------------------------------------------
----------------Get Failed Number of Attempts-------------
----------------------------------------------------------
*********************************************************/

async function grabFailedAttempts(username, filepath) {
    try {
        const data = await fs.readFile(filepath, 'utf8');
        const jSONuserData = JSON.parse(data);
        const user = jSONuserData.users.find(user => user.username === username);
        return user ? user.failedAttempts : null;
    }
    catch (error) {
        console.error('Error reading the JSON File:', error);
        return null;
    }
}

/*********************************************************
----------------------------------------------------------
Check Password for User and Update failed Attempts tracker
----------------------------------------------------------
*********************************************************/

async function checkPasswordAttempts (username, password, filePath) {
    try {
        let data = await fs.readFile(filePath, 'utf8');
        let jSONuserData = JSON.parse(data);
        let user = jSONuserData.users.find(user => user.username === username);

        if (user) {
            if (user.password === password) {
                // Reset failed attempts at successful login
                user.failedAttempts = 0;
                await fs.writeFile(filePath, JSON.stringify(jSONuserData, null, 4), 'utf8');
                console.log(`Failed attempts for user '${username}' reset successfully to 0.`);
                return true;
            } else {
                user.failedAttempts++;
                if (user.failedAttempts >= 5) {
                    // Delete user if failed login attempts reach 5
                    jSONuserData.users = jSONuserData.users.filter(u => u.username !== username);
                    await fs.writeFile(filePath, JSON.stringify(jSONuserData, null, 4), 'utf8');
                    console.log(`Failed attempt for user '${username}' Attempts remaing has reached 0`);
                    console.log(`User '${username}' has now been deleted, sucks to suck`);
                } else {
                    // Update failed login attempts
                    await fs.writeFile(filePath, JSON.stringify(jSONuserData, null, 4), 'utf8');
                    console.log(`Failed attempts for user '${username}'; Attempts remaining: ${5 - user.failedAttempts}.`);
                }
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error reading and or writing JSON file:', error);
        return false;
    }
}

/*********************************************************
----------------------------------------------------------
--------Redirection block based on function results-------
----------------------------------------------------------
*********************************************************/

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get('/mainpage', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/mainpage.html"));
});

app.get('*', (req, res) => {
    res.json("page not found");
});

app.listen(8080, () => {
    console.log("App is starting at port ", 8080);
});

/*********************************************************
----------------------------------------------------------
-------------------Login Data chunk-----------------------
----------------------------------------------------------
*********************************************************/

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        // Check if the user exists
        const userFound = await findUserID(username, usersFile);
        if (userFound) {
            // Check if the password is correct
            const passwordCorrect = await checkPasswordAttempts(username, password, usersFile);
            // log used for trouble shooting ---- console.log ("user found");
            if (passwordCorrect) {
                res.json({ success: true, message: 'Login successful' });
            } else {
                const failedAttempts = await grabFailedAttempts(username, usersFile);
                res.json({ success: false, message: `Incorrect password: ${failedAttempts}` });
            }
        } else {
            res.json({ success: false, message: 'User does not exist' });
        }
    } catch (error) {
        console.error('Error processing login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/*********************************************************
----------------------------------------------------------
------------------SignUp Data chunk-----------------------
----------------------------------------------------------
*********************************************************/

app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        // Check if the user already exists
        const userFound = await findUserID(username, usersFile);
        if (userFound) {
            res.json({ success: false, message: 'User Already Exists' });
        } else {
            // Create the user
            createUser(username, password, usersFile)
                .then(success => {
                    if (success) {
                        console.log("User created successfully!");
                        res.json({ success: true, message: 'User Created' });
                    } else {
                        // console.log("Username Taken");
                        res.json({ success: false, message: 'User Already Exists' });
                    }
                })
                .catch(error => {
                    console.error("Error creating user:", error);
                    res.json({ success: false, message: 'Error creating user' });
                });
        }
    } catch (error) {
        console.error('Error processing signup:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
