const express = require('express');
const fs = require('fs').promises;
const app = express();
app.use(express.static('Movie Page'));
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));
const mongoose = require('mongoose');

const path = require('path');

const mongoData = 'mongoData.json';

app.listen(8080, () => {
    console.log("Server is running on port", 8080);
});