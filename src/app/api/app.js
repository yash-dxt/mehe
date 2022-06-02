const bodyParser = require('body-parser');
const express = require('express');
require('express-async-errors');

const errorHandlingMiddleware = require('../middleware/errors');

const authenticationRouter = require('./routes/authentication');

let app = express();

//Fun Fact: this isn't deprecated - it just shows it is - the package has some technical prob.
app.use(bodyParser.json());

app.use('/auth', authenticationRouter());

app.use(errorHandlingMiddleware());

module.exports = app;