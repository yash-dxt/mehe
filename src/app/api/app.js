const bodyParser = require('body-parser');
const express = require('express');

let app = express();

//Fun Fact: this isn't deprecated - it just shows it is - the package has some technical prob.
app.use(bodyParser.json());

module.exports = app;