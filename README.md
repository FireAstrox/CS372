# CS372
CS372 Project Repo

## Prerequisites

Before you begin, make sure you have the following installed:
- Git [Install here](https://git-scm.com/downloads)
- Node.js [Install here](https://nodejs.org/en/download/current)
- MongoDB Community Server [Install here](https://www.mongodb.com/try/download/community)
  - For Ubuntu users follow this [link](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/) for installation instructions 
  - For MongoDB, MongoDB Compass is required
  - [Compass](https://www.mongodb.com/try/download/compass)

## These instructions are written for the use of MongoDB Compass Only

### 1. Clone the Repository
Run `git clone https://github.com/FireAstrox/CS372`

### 2. Setup MongoDB

- Open MongoDB Compass
- For Linux users ensure mongodb is running with
   
  `sudo systemctl start mongod` for ubuntu users or
    
  `sudo systemctl start mongodb.service` for other linux distros
    
  if these commands do not work please refer [here](https://www.mongodb.com/docs/manual/administration/install-on-linux/) for instructions for your specific distro
- In the URI text box use `mongodb://localhost:27017` and click connect
- Create a database named `Movie_Site`, you will be asked to create a collection at the same time, only one collection can be made here if you choose to do so, the second must be made seperately. 
- Within this database, create two collections: `Movies` and `Users`.

### 3. Populate Users Collection

In the `Users` collection, Add Data and import from a JSON/CSV File  
* Select the Movie_Site.Users.json file

The following fields should be present: 

- `username`: A string representing the username.
- `hashedPassword`: A string containing a SHA256 hashed password.
- `role`: The role of the user.

Verify users with the following usernames and roles:
- Viewer
- Marketing-Manager
- Content-Manager

### Passwords 
 - Viewer: `password`
 - Content-Manager: `password`
 - Marketing-Manager: `password`


Example User in JSON format:

{
  "_id": {  
    "$oid": "660121bd5db0d1b33ff29fd4"  
  },  
  "username": "Viewer",  
  "hashedPassword": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",  
  "role": "Viewer"  
}  

Example User in Compass:    
![image](https://github.com/FireAstrox/CS372/assets/112352211/78a16ada-4fb1-489a-b743-116c570aece5)


### 4. Start the Server

Navigate to the cloned repository's directory in a terminal, then run:  
`node movie_server.js`

### 5. Access the Site

Open a web browser and navigate to:  
`localhost:8080`  
