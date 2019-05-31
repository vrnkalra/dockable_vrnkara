var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

require('dotenv').config({
    path: 'local.env'
});

var signatureVerification = require('./Utils/signatureVerifications');
require('./Utils/db');

var todoRouter = require('./routes/todo');

var app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(signatureVerification);
app.use('/todo', todoRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;