var express = require('express');
var logger = require('morgan');

require('dotenv').config({
    path: 'local.env'
});

var signatureVerification = require('./Utils/signatureVerifications');

var todoRouter = require('./routes/todo');

var app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(signatureVerification);

app.use('/todo', todoRouter);

module.exports = app;