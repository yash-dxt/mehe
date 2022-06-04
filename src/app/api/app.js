const bodyParser = require('body-parser');
const express = require('express');
require('express-async-errors');

const errorHandlingMiddleware = require('../middleware/errors');

const authenticationRouter = require('./routes/authentication');
const thoughtRouter = require('../api/routes/thoughts');
const replyRouter = require('../api/routes/replies');

let app = express();

app.use(bodyParser.json());

app.use('/auth', authenticationRouter());
app.use('/thought', thoughtRouter());
app.use('/reply', replyRouter());


app.use(errorHandlingMiddleware());

module.exports = app;