const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();
//sentry.io
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: 'https://3b0688b85a2b4a7b836501adec1ed46c@sentry.io/1538856'
});

const usersRouter = require('../users/users-router.js');
const vehicleRouter = require('../vehicles/vehicle-router.js');


// allow cross origin access for dev server and hosted app
let whiteList = ["https://www.rvnav.com", "http://localhost:3000", "https://rvnav.herokuapp.com"]
let corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
    callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
  }
}}

// This request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());


// Enables cors preflight across the board
app.options("*", cors())

// SANITY CHECK ENDPOINT
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});

// ROUTER ENDPOINTS
app.use('/users', usersRouter);
app.use('/vehicle', vehicleRouter);

//sentry.io
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

// CUSTOM 404 & ERROR HANDLER
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
