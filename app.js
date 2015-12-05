var express = require('express');
var path = require('path');
var logger = require('morgan');
var routes = require('./routes.js');

// setup express.js
var app = express();
app.use(logger('dev'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// express.js routes
app.use('/api/tweets/:topic', routes.getTweets);
app.use('/api/topics', routes.getTopics);

// startup server
var server = app.listen(process.env.PORT || 80, () => console.log('Server is running.'));
