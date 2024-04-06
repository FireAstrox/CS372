# CS372
CS372 Project Repo

## Prerequisites

Before you begin, make sure you have the following installed:
- Git
- Node.js
- MongoDB
  - For MongoDB, we used MongoDB Compass for ease of use, especially on Windows.

### 1. Clone the Repository
git clone [[github repo link](https://github.com/FireAstrox/CS372)]

### 2. Setup MongoDB

- Open MongoDB (We recommend Compass for ease of use on Windows).
- Create a database named `Movie_Site`.
- Within this database, create two collections: `Movies` and `Users`.

### 3. Populate Users Collection

In the `Users` collection, create 3 objects with the following schema:

- `username`: A string representing the username.
- `hashedPassword`: A string containing a SHA256 hashed password.
- `role`: The role of the user.

Add users with the following roles:
- Viewer
- Marketing-Manager
- Content-Manager

For passwords, use a SHA256 hash calculator. Example: [SHA256 Hash Calculator](https://xorbin.com/tools/sha256-hash-calculator).

Example User Document:

{  
"username": "Viewer",  
"hashedPassword": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"  
"role": "Viewer"  
}

![image](https://github.com/FireAstrox/CS372/assets/112352211/78a16ada-4fb1-489a-b743-116c570aece5)


### 4. Start the Server

Navigate to the cloned repository's directory in a terminal, then run:  
`node movie_server.js`

### 5. Access the Site

Open a web browser and navigate to:  
`localhost:8080`  
