const express = require('express');
const fs = require('fs').promises;
const app = express();
app.use(express.static('Movie Page'));
const bodyParser = require('body-parser');