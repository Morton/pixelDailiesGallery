var express = require('express');
var path = require('path');
var logger = require('morgan');

// load json
var jsonfile = require('jsonfile');
var filename = 'data.json';
allTweets = jsonfile.readFileSync(filename);

// setup express.js
var app = express();
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// express.js routes
app.use('/api/tweets/:topic', function (req, res) {
    var _t = allTweets.topics.filter((v)=> v.hashtags.indexOf(req.params.topic) > -1)[0];
    res.send({
        tweets: allTweets.tweets.filter((v)=> v.hashtags.indexOf(req.params.topic) > -1),
        text: _t.text,
        creation_date: _t.creation_date
    });
});
app.use('/api/topics', function (req, res) {
    res.send(allTweets.topics.map((v)=> v.hashtags.filter((v) => v!='pixel_dailies')).filter((v)=>v&& v.length>0));
});

// startup server
var server = app.listen(3000, () => console.log('Server is running.'));
