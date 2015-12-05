// imports
var jsonfile = require('jsonfile');

// init
var filename = 'data.json';
allTweets = jsonfile.readFileSync(filename);

// static class definition
var routes = {
    getTweets: function (req, res) {
        var _t = allTweets.topics.filter((v)=> v.hashtags.indexOf(req.params.topic) > -1)[0];
        res.send({
            tweets: allTweets.tweets.filter((v)=> v.hashtags.indexOf(req.params.topic) > -1),
            text: _t.text,
            creation_date: _t.creation_date
        });
    },
    getTopics: function (req, res) {
        res.send(allTweets.topics.map((v)=> v.hashtags.filter((v) => v!='pixel_dailies')).filter((v)=>v&& v.length>0));
    }
};

// export
module.exports = routes;