const express = require('express');
const fs = require('fs').promises;
const app = express();
app.use(express.static('Movie Page'));
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));

const path = require('path');

const mongoData = 'mongoData.json';